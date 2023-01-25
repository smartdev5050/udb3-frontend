import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { OfferType, OfferTypes } from '@/constants/OfferType';
import { useGetEventByIdQuery } from '@/hooks/api/events';
import { useAddOfferPriceInfoMutation } from '@/hooks/api/offers';
import { useGetPlaceByIdQuery } from '@/hooks/api/places';
import i18n from '@/i18n/index';
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
import { TabContentProps } from '@/pages/steps/AdditionalInformationStep/AdditionalInformationStep';

const PRICE_CURRENCY: string = 'EUR';

const PRICE_REGEX: RegExp = /^([1-9][0-9]*|[0-9]|[0])(,[0-9]{1,2})?$/;

const PriceCategories = {
  BASE: 'base',
  TARIFF: 'tariff',
  UITPAS: 'uitpas',
} as const;

type PriceCategory = Values<typeof PriceCategories>;

type NameInLanguages = Partial<{
  nl: string;
  fr: string;
  de: string;
  en: string;
}>;

type Rate = {
  name: NameInLanguages;
  category: PriceCategory;
  price: string;
  priceCurrency: string;
};

type FormData = { rates: Rate[] };

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

const isNotUitpas = (value: any): boolean => {
  return !value[i18n.language].toLowerCase().startsWith('uitpas');
};

const shouldHaveAName = (value: any): boolean => {
  return !!value[i18n.language];
};

const schema = yup
  .object()
  .shape({
    rates: yup.array().of(
      yup.object({
        name: yup
          .object({
            nl: yup.string(),
            fr: yup.string(),
            en: yup.string(),
            de: yup.string(),
          })
          .test(`name-is-required`, 'name is required', shouldHaveAName)
          .test(`name-is-not-uitpas`, 'should not be uitpas', isNotUitpas)
          .required(),
        category: yup.string(),
        price: yup.string().matches(PRICE_REGEX).required(),
        priceCurrency: yup.string(),
      }),
    ),
  })
  .required();

const PriceInformation = ({
  scope,
  offerId,
  onChangeCompleted,
  onSuccessfulChange,
  ...props
}: TabContentProps) => {
  // TODO: refactor
  const eventId = offerId;

  const { t, i18n } = useTranslation();
  const formComponent = useRef<HTMLFormElement>();
  const [hasGlobalError, setHasGlobalError] = useState(false);
  const [hasUitpasError, setHasUitpasError] = useState(false);

  const [duplicateNameError, setDuplicateNameError] = useState('');
  const [priceInfo, setPriceInfo] = useState([]);

  const useGetOfferByIdQuery =
    scope === OfferTypes.EVENTS ? useGetEventByIdQuery : useGetPlaceByIdQuery;

  const getOfferByIdQuery = useGetOfferByIdQuery(
    { id: offerId },
    { refetchOnWindowFocus: false },
  );

  // @ts-expect-error
  const offer: Event | Place | undefined = getOfferByIdQuery.data;

  useEffect(() => {
    let newPriceInfo = offer?.priceInfo ?? [];

    if (newPriceInfo.length > 0) {
      onChangeCompleted(true);
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

    setPriceInfo(newPriceInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offer?.priceInfo, offer?.mainLanguage, i18n.language]);

  const {
    register,
    control,
    setValue,
    trigger,
    formState: { errors, dirtyFields },
    handleSubmit,
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    reValidateMode: 'onBlur',
    shouldFocusError: false,
    defaultValues: defaultPriceInfoValues,
  });

  useEffect(() => {
    if (!priceInfo?.length) return;
    setValue('rates', [...priceInfo]);
  }, [priceInfo, setValue]);

  const rates = useWatch({ control, name: 'rates' });

  const addPriceInfoMutation = useAddOfferPriceInfoMutation({
    onSuccess: () => {
      setTimeout(() => {
        onSuccessfulChange();
      }, 1000);
    },
  });

  const handlePriceInfoSubmitValid = async (rates: Rate[]) => {
    const convertedPriceInfo = rates.map((rate: Rate) => {
      return {
        ...rate,
        price: parseFloat(rate.price.replace(',', '.')),
      };
    });

    await addPriceInfoMutation.mutateAsync({
      id: offerId,
      priceInfo: convertedPriceInfo,
      scope,
    });
  };

  const handleClickAddRate = () => {
    setValue('rates', [
      ...rates,
      {
        name: {
          [i18n.language]: '',
        },
        price: '',
        category: PriceCategories.TARIFF,
        priceCurrency: PRICE_CURRENCY,
      },
    ]);
  };

  const handleClickDeleteRate = async (id: number): Promise<void> => {
    const ratesWithDeletedItem = [
      ...rates.filter((_rate, index) => id !== index),
    ];
    setValue('rates', ratesWithDeletedItem);

    const selectedRate = rates[id];

    // if rate exists on priceInfo, also delete it from API

    const existsInCurrentData = priceInfo.some(
      (priceInfoItem) =>
        selectedRate.name[i18n.language] ===
          priceInfoItem.name[i18n.language] &&
        selectedRate.price === priceInfoItem.price,
    );

    if (existsInCurrentData) {
      await handlePriceInfoSubmitValid(ratesWithDeletedItem);
    }
  };

  const getDuplicateName = () => {
    const seenRates = [];

    const duplicateName =
      rates.find((rate) => {
        const name = rate.name[i18n.language];

        if (seenRates.includes(name)) {
          return true;
        }

        seenRates.push(name);
      })?.name[i18n.language] ?? '';

    return duplicateName;
  };

  const handleDuplicateNameError = (priceName: string): void => {
    setDuplicateNameError(
      t('create.additionalInformation.price_info.duplicate_name_error', {
        priceName,
      }),
    );
  };

  const setFreePriceToRate = async (): Promise<void> => {
    const isValid = await trigger();

    if (!isValid) return;

    const duplicateName = getDuplicateName();

    if (duplicateName) {
      handleDuplicateNameError(duplicateName);
      return;
    }

    // If no errors submit to API
    await handlePriceInfoSubmitValid(rates);
  };

  const isPriceFree = (price: string): boolean => {
    return ['0', '0,0', '0,00'].includes(price);
  };

  const hasUitpasPrices = useMemo(() => {
    return rates.some((rate) => rate.category === PriceCategories.UITPAS);
  }, [rates]);

  useEffect(() => {
    if (Object.keys(dirtyFields).length === 0) return;

    const errorRates = (errors.rates || []).filter(
      (error: any) => error !== undefined,
    );

    const hasGlobalError = errorRates.length > 0;
    const hasUitpasError = errorRates.some(
      (error) => error.name?.type === 'name-is-not-uitpas',
    );

    setHasGlobalError(hasGlobalError);
    setHasUitpasError(hasUitpasError);
  }, [errors, i18n.language, dirtyFields]);

  return (
    <Stack
      {...getStackProps(props)}
      as="form"
      padding={4}
      onBlur={handleSubmit(async (data) => {
        const duplicateName = getDuplicateName();

        if (duplicateName) {
          handleDuplicateNameError(duplicateName);
          return;
        }

        setDuplicateNameError('');
        await handlePriceInfoSubmitValid(data.rates);
      })}
      ref={formComponent}
    >
      {hasUitpasPrices && (
        <Alert variant={AlertVariants.PRIMARY} marginBottom={3}>
          {t('create.additionalInformation.price_info.uitpas_info')}
        </Alert>
      )}
      {rates.map((rate, index) => (
        <Inline
          key={`rate_${index}`}
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
                          i18n.language as keyof NameInLanguages
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
                    onClick={() => {
                      setValue(`rates.${index}.price`, '0,00');
                      setFreePriceToRate();
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
                  onClick={() => handleClickDeleteRate(index)}
                >
                  {t('create.additionalInformation.price_info.delete')}
                </Button>
              )}
            </Inline>
          </Inline>
        </Inline>
      ))}
      {hasGlobalError && (
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
        <Button onClick={handleClickAddRate} variant={ButtonVariants.SECONDARY}>
          {t('create.additionalInformation.price_info.add')}
        </Button>
      </Inline>
    </Stack>
  );
};

export { PriceInformation };
