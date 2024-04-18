import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { ValidationError } from 'yup';

import { OfferTypes } from '@/constants/OfferType';
import {
  useAddOfferPriceInfoMutation,
  useGetOfferByIdQuery,
} from '@/hooks/api/offers';
import i18n, { SupportedLanguage } from '@/i18n/index';
import {
  TabContentProps,
  ValidationStatus,
} from '@/pages/steps/AdditionalInformationStep/AdditionalInformationStep';
import { isUitpasOrganizer } from '@/pages/steps/AdditionalInformationStep/OrganizerPicker';
import { Offer } from '@/types/Offer';
import type { Values } from '@/types/Values';
import { Alert, AlertVariants } from '@/ui/Alert';
import { parseSpacing } from '@/ui/Box';
import { Button, ButtonSizes, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { Breakpoints, getValueFromTheme } from '@/ui/theme';
import { reconcileRates } from '@/utils/reconcileRates';

const PRICE_CURRENCY: string = 'EUR';

const PRICE_REGEX: RegExp = /^([1-9][0-9]*|[0-9]|0)([.,][0-9]{1,2})?$/;

const PriceCategory = {
  BASE: 'base',
  TARIFF: 'tariff',
  UITPAS: 'uitpas',
} as const;

type PriceCategory = Values<typeof PriceCategory>;

const getValue = getValueFromTheme('priceInformation');

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
                  .test(`name_is_required`, 'name is required', shouldHaveAName)
                  .test(
                    `name_is_not_uitpas`,
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
      .test('unique_name', 'No unique name', (prices, context) => {
        const priceNames = (prices ?? []).map(
          (item) => item.name[i18n.language],
        );
        const errors = priceNames
          .map((priceName, index) => {
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
          })
          .filter(Boolean);

        return errors.length ? new ValidationError(errors) : true;
      }),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const defaultPriceInfoValues: FormData = {
  rates: [
    {
      name: {
        nl: 'Basistarief',
        fr: 'Tarif de base',
        en: 'Base tariff',
        de: 'Basisrate',
      },
      price: '',
      category: PriceCategory.BASE,
      priceCurrency: PRICE_CURRENCY,
    },
  ],
};

const PriceInformation = ({
  scope,
  offerId,
  onValidationChange,
  onSuccessfulChange,
  ...props
}: TabContentProps) => {
  const { t, i18n } = useTranslation();
  const [isPricesLoaded, setIsPricesLoaded] = useState(false);

  const getOfferByIdQuery = useGetOfferByIdQuery(
    { id: offerId, scope },
    { refetchOnWindowFocus: false },
  );

  // @ts-expect-error
  const offer: Offer | undefined = getOfferByIdQuery.data;

  const {
    register,
    trigger,
    control,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: defaultPriceInfoValues,
    shouldFocusError: false,
  });

  const { fields, replace, append, remove } = useFieldArray({
    name: 'rates',
    control,
  });

  const rates = watch('rates');
  const controlledRates = fields.map((field, index) => ({
    ...field,
    ...rates[index],
  }));

  const addPriceInfoMutation = useAddOfferPriceInfoMutation({
    onSuccess: (data) => {
      const isFormDirty = Object.keys(dirtyFields).length > 0;
      if (typeof data === 'undefined' || !isFormDirty) return;

      return setTimeout(() => onSuccessfulChange(), 1000);
    },
  });

  const onSubmit = useCallback(
    () =>
      handleSubmit((data) => {
        addPriceInfoMutation.mutate({
          id: offerId,
          scope,
          priceInfo: (data.rates ?? []).map((rate) => ({
            ...rate,
            price: parseFloat(rate.price.replace(',', '.')),
          })),
        });
      })(),
    [addPriceInfoMutation, handleSubmit, offerId, scope],
  );

  const isPriceFree = (price: string) => ['0', '0,0', '0,00'].includes(price);
  const hasUitpasPrices = useMemo(
    () => (rates ?? []).some((rate) => rate.category === PriceCategory.UITPAS),
    [rates],
  );

  const hasRates = useMemo(
    () => controlledRates.filter((rate) => rate.price !== '').length > 0,
    [controlledRates],
  );

  useEffect(() => {
    const priceInfo = offer?.priceInfo ?? [];

    const hasUitpasLabel =
      offer?.organizer && scope === OfferTypes.EVENTS
        ? isUitpasOrganizer(offer?.organizer)
        : false;

    if (!hasRates) {
      replace(priceInfo.length ? priceInfo : defaultPriceInfoValues.rates);
      reset({}, { keepValues: true });

      return onValidationChange(
        hasUitpasLabel ? ValidationStatus.WARNING : ValidationStatus.NONE,
      );
    }

    onValidationChange(ValidationStatus.SUCCESS);

    replace(reconcileRates(rates, priceInfo, offer));
    reset({}, { keepValues: true });
    // onValidationChange is hard to wrap in useCallback in parent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    scope,
    i18n.language,
    offer?.mainLanguage,
    offer?.organizer,
    offer?.priceInfo,
    replace,
  ]);

  useEffect(() => {
    if (isPricesLoaded) return;

    if (!offer?.priceInfo) return;

    if (offer.priceInfo.length > 0) {
      onValidationChange(ValidationStatus.SUCCESS);
    }

    setIsPricesLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offer?.priceInfo, isPricesLoaded]);

  return (
    <Stack {...getStackProps(props)} padding={4} spacing={5}>
      <Inline spacing={4} stackOn={Breakpoints.M}>
        <Stack flex="1 0 60%">
          {controlledRates.map((rate, index) => {
            const registerNameProps = register(
              `rates.${index}.name.${i18n.language as SupportedLanguage}`,
            );

            const registerPriceProps = register(`rates.${index}.price`);

            const validationErrorType =
              errors.rates?.[index]?.name?.type ||
              errors.rates?.[index]?.price?.type ||
              errors.rates?.[index]?.type;

            return (
              <Stack key={`rate_${rate.id}`}>
                <Inline
                  css={`
                    border-bottom: 1px solid ${getValue('borderColor')};
                  `}
                >
                  <Inline
                    width="100%"
                    paddingY={3}
                    alignItems="baseline"
                    justifyContent="flex-start"
                    spacing={3}
                  >
                    <Inline minWidth="55%">
                      {rate.category === PriceCategory.BASE && (
                        <Text width="100%">{rate.name[i18n.language]}</Text>
                      )}
                      {rate.category === PriceCategory.TARIFF && (
                        <FormElement
                          id={`rate_name_${rate.id}`}
                          Component={
                            <Input
                              {...registerNameProps}
                              onBlur={async (e) => {
                                await registerNameProps.onBlur(e);
                                const isValid = await trigger();
                                if (!isValid) {
                                  return;
                                }

                                onSubmit();
                              }}
                              placeholder={t(
                                'create.additionalInformation.price_info.target',
                              )}
                            />
                          }
                        />
                      )}
                      {rate.category === PriceCategory.UITPAS && (
                        <Text>{rate.name[i18n.language]}</Text>
                      )}
                    </Inline>
                    <Inline alignItems="center">
                      {rate.category && (
                        <FormElement
                          id={`rate_price_${rate.id}`}
                          Component={
                            <Input
                              width="6rem"
                              marginRight={3}
                              {...registerPriceProps}
                              onBlur={async (e) => {
                                await registerPriceProps.onBlur(e);
                                const isValid = await trigger();
                                if (!isValid) {
                                  return;
                                }

                                onSubmit();
                              }}
                              placeholder={t(
                                'create.additionalInformation.price_info.price',
                              )}
                              disabled={rate.category === PriceCategory.UITPAS}
                            />
                          }
                        />
                      )}
                    </Inline>
                    <Inline>
                      <Text
                        variant={TextVariants.MUTED}
                        css={`
                          margin-right: ${parseSpacing(3)};
                        `}
                      >
                        {t('create.additionalInformation.price_info.euro')}
                      </Text>
                      {!isPriceFree(rate.price) &&
                        rate.category !== PriceCategory.UITPAS && (
                          <Button
                            variant={ButtonVariants.LINK}
                            onClick={() => {
                              setValue(`rates.${index}.price`, '0,00', {
                                shouldValidate: false,
                              });
                              onSubmit();
                              getOfferByIdQuery.remove();
                            }}
                          >
                            {t('create.additionalInformation.price_info.free')}
                          </Button>
                        )}
                    </Inline>
                    {index !== 0 && rate.category !== PriceCategory.UITPAS && (
                      <Button
                        iconName={Icons.TRASH}
                        variant={ButtonVariants.DANGER}
                        size={ButtonSizes.SMALL}
                        aria-label={t(
                          'create.additionalInformation.price_info.delete',
                        )}
                        onClick={() => {
                          remove(index);
                          onSubmit();
                        }}
                      />
                    )}
                  </Inline>
                </Inline>
                {validationErrorType && (
                  <Text color="red">
                    {t(
                      `create.additionalInformation.price_info.validation_messages.${validationErrorType}`,
                    )}
                  </Text>
                )}
              </Stack>
            );
          })}
          <Inline marginTop={3}>
            <Button
              onClick={() => {
                append(
                  {
                    name: { [i18n.language as SupportedLanguage]: '' },
                    price: '',
                    category: PriceCategory.TARIFF,
                    priceCurrency: PRICE_CURRENCY,
                  },
                  {
                    focusName: `rates.${fields.length}.name`,
                    shouldFocus: true,
                  },
                );
              }}
              variant={ButtonVariants.SECONDARY}
            >
              {t('create.additionalInformation.price_info.add')}
            </Button>
          </Inline>
        </Stack>
        <Stack spacing={4}>
          <Alert
            fullWidth
            css={`
              width: 100%;
            `}
            variant={AlertVariants.PRIMARY}
          >
            {t('create.additionalInformation.price_info.global_info')}
          </Alert>
          {hasUitpasPrices && (
            <Alert
              fullWidth
              css={`
                width: 100%;
              `}
              variant={AlertVariants.PRIMARY}
              marginBottom={3}
            >
              {t('create.additionalInformation.price_info.uitpas_info')}
            </Alert>
          )}
        </Stack>
      </Inline>
    </Stack>
  );
};

export { PriceCategory, PriceInformation };
