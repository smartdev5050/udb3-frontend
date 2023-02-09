import { yupResolver } from '@hookform/resolvers/yup';
import { throttle } from 'lodash';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { ValidationError } from 'yup';

import { OfferTypes } from '@/constants/OfferType';
import { useGetEventByIdQuery } from '@/hooks/api/events';
import { useAddOfferPriceInfoMutation } from '@/hooks/api/offers';
import { useGetPlaceByIdQuery } from '@/hooks/api/places';
import i18n, { SupportedLanguage } from '@/i18n/index';
import {
  TabContentProps,
  ValidationStatus,
} from '@/pages/steps/AdditionalInformationStep/AdditionalInformationStep';
import { isUitpasOrganizer } from '@/pages/steps/AdditionalInformationStep/OrganizerPicker';
import { Event } from '@/types/Event';
import type { Values } from '@/types/Values';
import { Alert, AlertVariants } from '@/ui/Alert';
import { Box, parseSpacing } from '@/ui/Box';
import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

const PRICE_CURRENCY: string = 'EUR';

const PRICE_REGEX: RegExp = /^([1-9][0-9]*|[0-9]|[0])(,[0-9]{1,2})?$/;

const PriceCategory = {
  BASE: 'base',
  TARIFF: 'tariff',
  UITPAS: 'uitpas',
} as const;

type PriceCategory = Values<typeof PriceCategory>;

const getValue = getValueFromTheme('priceInformation');

const defaultPriceInfoValues = {
  rates: [
    {
      name: {
        nl: 'Basistarief',
        fr: 'Tarif de base',
        en: 'Base tariff',
        de: 'Basisrate',
      },
      price: '',
      category: PriceCategories.BASE,
      priceCurrency: PRICE_CURRENCY,
    },
  ],
};

const isNotUitpas = (value: any) =>
  value[i18n.language] &&
  !value[i18n.language].toLowerCase().startsWith('uitpas');

const shouldHaveAName = (value: any) => !!value[i18n.language];

type Name = Partial<
  Record<SupportedLanguage | 'en', ReturnType<typeof yup.string>>
>;

const schema = yup
  .object({
    rates: yup
      .array()
      .of(
        yup.object({
          name: yup
            .object<Name>({
              nl: yup.string(),
              fr: yup.string(),
              en: yup.string(),
              de: yup.string(),
            })
            .when('category', {
              is: (category) => category !== PriceCategory.UITPAS,
              then: (schema) =>
                schema
                  .test(`name-is-required`, 'name is required', shouldHaveAName)
                  .test(
                    `name-is-not-uitpas`,
                    'should not be uitpas',
                    isNotUitpas,
                  )
                  .required(),
            }),
          category: yup
            .mixed<PriceCategory>()
            .oneOf(Object.values(PriceCategory)),
          price: yup.string().matches(PRICE_REGEX).required(),
          priceCurrency: yup.string(),
        }),
      )
      .test('uniqueName', 'No unique name', (prices, context) => {
        const priceNames = prices.map((item) => item.name[i18n.language]);
        const errors = priceNames.map((priceName, index) => {
          const indexOf = priceNames.indexOf(priceName);
          if (indexOf !== -1 && indexOf !== index) {
            return context.createError({
              path: `${context.path}.${index}`,
              message: i18n.t(
                'create.additionalInformation.price_info.duplicate_name_error',
                { priceName },
              ),
            });
          }
        });

        return errors.length ? new ValidationError(errors) : true;
      }),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const PriceInformation = ({
  scope,
  offerId,
  onValidationChange,
  onSuccessfulChange,
  ...props
}: TabContentProps) => {
  const { t, i18n } = useTranslation();

  const useGetOfferByIdQuery =
    scope === OfferTypes.EVENTS ? useGetEventByIdQuery : useGetPlaceByIdQuery;

  const getOfferByIdQuery = useGetOfferByIdQuery(
    { id: offerId },
    { refetchOnWindowFocus: false },
  );

  // @ts-expect-error
  const offer: Event | Place | undefined = getOfferByIdQuery.data;

  const {
    register,
    trigger,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(schema),
    shouldFocusError: false,
    defaultValues: { rates: [] },
  });

  const errorRates = useMemo(
    () => (errors?.rates ?? []).filter((error: any) => error !== undefined),
    [errors.rates],
  );

  const hasGlobalError = useMemo(() => errorRates.length > 0, [errorRates]);
  const duplicateNameError = useMemo(
    () => errorRates.find((error) => error.type === 'uniqueName')?.message,
    [errorRates],
  );
  const hasUitpasError = useMemo(
    () => errorRates.some((error) => error.name?.type === 'name-is-not-uitpas'),
    [errorRates],
  );

  const ratesField = useFieldArray({ name: 'rates', control });
  const rates = watch('rates');
  const controlledRates = ratesField.fields.map((field, index) => ({
    ...field,
    ...rates[index],
  }));

  const addPriceInfoMutation = useAddOfferPriceInfoMutation({
    onSuccess: () => setTimeout(() => onSuccessfulChange(), 1000),
  });

  const updatePriceInfo = throttle(
    () =>
      addPriceInfoMutation.mutateAsync({
        id: offerId,
        scope,
        priceInfo: getValues('rates').map((rate) => ({
          ...rate,
          price: parseFloat(rate.price.replace(',', '.')),
        })),
      }),
    1000,
  );

  const onSubmit = useCallback(
    () => (hasGlobalError ? null : updatePriceInfo()),
    [updatePriceInfo, hasGlobalError],
  );

  const isPriceFree = (price: string) => ['0', '0,0', '0,00'].includes(price);
  const hasUitpasPrices = useMemo(
    () => rates.some((rate) => rate.category === PriceCategory.UITPAS),
    [rates],
  );

  useEffect(() => {
    let newPriceInfo = offer?.priceInfo ?? [];
    const hasUitpasLabel = offer?.organizer
      ? isUitpasOrganizer(offer?.organizer)
      : false;

    if (newPriceInfo.length > 0) {
      onValidationChange(ValidationStatus.SUCCESS);
    } else {
      onValidationChange(
        hasUitpasLabel ? ValidationStatus.WARNING : ValidationStatus.NONE,
      );
    }

    if (!newPriceInfo.length) {
      return ratesField.replace(defaultPriceInfoValues.rates);
    }

    const mainLanguage = offer?.mainLanguage;
    newPriceInfo = newPriceInfo.map((rate: any) => {
      return {
        ...rate,
        name: {
          ...rate.name,
          [i18n.language]: rate.name[i18n.language] ?? rate.name[mainLanguage],
        },
        price: rate.price.toFixed(2).replace('.', ','),
      };
    });

    if (!rates.length) {
      ratesField.replace(newPriceInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offer?.organizer, offer?.priceInfo, offer?.mainLanguage, i18n.language]);

  return (
    <Stack
      {...getStackProps(props)}
      as="form"
      padding={4}
      onBlur={handleSubmit(onSubmit)}
    >
      {hasUitpasPrices && (
        <Alert variant={AlertVariants.PRIMARY} marginBottom={3}>
          {t('create.additionalInformation.price_info.uitpas_info')}
        </Alert>
      )}
      {controlledRates.map((rate, index) => (
        <Inline
          key={`rate_${rate.id}`}
          paddingTop={3}
          paddingBottom={3}
          css={`
            border-bottom: 1px solid ${getValue('borderColor')};
          `}
        >
          <Inline width="100%" alignItems="center">
            <Inline width="30%">
              {rate.category === PriceCategories.BASE && (
                <Text>{rate.name[i18n.language]}</Text>
              )}
              {rate.category === PriceCategories.TARIFF && (
                <FormElement
                  id={`rate_name_${index}`}
                  Component={
                    <Input
                      {...register(
                        `rates.${index}.name.${
                          i18n.language as SupportedLanguage
                        }`,
                      )}
                      placeholder={t(
                        'create.additionalInformation.price_info.target',
                      )}
                    />
                  }
                />
              )}
              {rate.category === PriceCategories.UITPAS && (
                <Text>{rate.name[i18n.language]}</Text>
              )}
            </Inline>
            <Inline width="40%" alignItems="center">
              {rate.category && (
                <FormElement
                  id={`rate_price_${index}`}
                  Component={
                    <Input
                      marginRight={3}
                      {...register(`rates.${index}.price`)}
                      placeholder={t(
                        'create.additionalInformation.price_info.price',
                      )}
                      disabled={rate.category === PriceCategories.UITPAS}
                    />
                  }
                />
              )}

              <Text
                variant={TextVariants.MUTED}
                css={`
                  margin-right: ${parseSpacing(3)};
                `}
              >
                {t('create.additionalInformation.price_info.euro')}
              </Text>
              {!isPriceFree(rate.price) &&
                rate.category !== PriceCategories.UITPAS && (
                  <Button
                    variant={ButtonVariants.LINK}
                    onClick={async () => {
                      setValue(`rates.${index}.price`, '0,00');
                      await trigger();
                      await onSubmit();
                    }}
                  >
                    {t('create.additionalInformation.price_info.free')}
                  </Button>
                )}
            </Inline>
            <Inline width="30%" justifyContent="flex-end">
              {index !== 0 && rate.category !== PriceCategories.UITPAS && (
                <Button
                  iconName={Icons.TRASH}
                  spacing={3}
                  variant={ButtonVariants.DANGER}
                  onClick={async () => {
                    ratesField.remove(index);
                    await trigger();
                    await onSubmit();
                  }}
                >
                  {t('create.additionalInformation.price_info.delete')}
                </Button>
              )}
            </Inline>
          </Inline>
        </Inline>
      ))}
      {hasGlobalError && !duplicateNameError && (
        <Alert marginTop={3} variant={AlertVariants.PRIMARY}>
          <Box
            forwardedAs="div"
            dangerouslySetInnerHTML={{
              __html: t('create.additionalInformation.price_info.global_error'),
            }}
            css={`
              ul {
                list-style-type: disc;

                li {
                  margin-left: ${parseSpacing(5)};
                }
              }
            `}
          />
        </Alert>
      )}
      {hasUitpasError && (
        <Alert marginTop={3} variant={AlertVariants.WARNING}>
          {t('create.additionalInformation.price_info.uitpas_error')}
        </Alert>
      )}
      {!!duplicateNameError && (
        <Alert marginTop={3} variant={AlertVariants.DANGER}>
          {duplicateNameError}
        </Alert>
      )}
      <Inline marginTop={3}>
        <Button
          onClick={() =>
            ratesField.append({
              name: { [i18n.language as SupportedLanguage]: '' },
              price: '',
              category: PriceCategories.TARIFF,
              priceCurrency: PRICE_CURRENCY,
            })
          }
          variant={ButtonVariants.SECONDARY}
        >
          {t('create.additionalInformation.price_info.add')}
        </Button>
      </Inline>
    </Stack>
  );
};

export type { PriceCategory };
export { PriceInformation };
