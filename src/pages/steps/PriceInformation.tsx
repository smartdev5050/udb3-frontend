import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import {
  useAddPriceInfoMutation,
  useGetEventByIdQuery,
} from '@/hooks/api/events';
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

const PRICE_CURRENCY: string = 'EUR';

const PRICE_REGEX: RegExp = /^([1-9][0-9]*|[0-9]|[0])(,[0-9]{1,2})?$/;

const PriceCategories = {
  BASE: 'base',
  TARIFF: 'tariff',
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

type Props = {
  eventId: string;
  onChangeCompleted: (isCompleted: boolean) => void;
  onSuccessfulChange: () => void;
};

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
  eventId,
  onChangeCompleted,
  onSuccessfulChange,
  ...props
}: Props) => {
  const { t, i18n } = useTranslation();
  const formComponent = useRef<HTMLFormElement>();
  const [hasGlobalError, setHasGlobalError] = useState(false);
  const [hasUitpasError, setHasUitpasError] = useState(false);

  const [duplicateNameError, setDuplicateNameError] = useState('');
  const [priceInfo, setPriceInfo] = useState([]);

  const getEventByIdQuery = useGetEventByIdQuery(
    { id: eventId },
    { refetchOnWindowFocus: false },
  );

  // @ts-expect-error
  const event: Event | undefined = getEventByIdQuery.data;

  useEffect(() => {
    let newPriceInfo = event?.priceInfo ?? [];

    if (newPriceInfo.length > 0) {
      onChangeCompleted(true);
    }
    const mainLanguage = event?.mainLanguage;

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
  }, [event?.priceInfo, event?.mainLanguage, i18n.language]);

  const {
    register,
    watch,
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

  const watchedRates = watch('rates');

  const addPriceInfoMutation = useAddPriceInfoMutation({
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
      eventId,
      priceInfo: convertedPriceInfo,
    });
  };

  const handleClickAddRate = () => {
    setValue('rates', [
      ...watchedRates,
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
      ...watchedRates.filter((_rate, index) => id !== index),
    ];
    setValue('rates', ratesWithDeletedItem);

    const selectedRate = watchedRates[id];

    // if rate exists on priceInfo, also delete it from API
    // @ts-ignore
    const existsInCurrentData = priceInfo.some(
      (priceInfoItem) =>
        // @ts-ignore
        selectedRate.name[i18n.language] ===
          priceInfoItem.name[i18n.language] &&
        // @ts-ignore
        selectedRate.price === priceInfoItem.price,
    );

    if (existsInCurrentData) {
      await handlePriceInfoSubmitValid(ratesWithDeletedItem);
    }
  };

  const getDuplicateName = () => {
    const seenRates = [];

    const duplicateName =
      watchedRates.find((rate) => {
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
    await handlePriceInfoSubmitValid(watchedRates);
  };

  const isPriceFree = (price: string): boolean => {
    return ['0', '0,0', '0,00'].includes(price);
  };

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
      {watchedRates.map((rate, index) => (
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
            </Inline>
            <Inline width="40%" alignItems="center">
              <FormElement
                id={`rate_price_${index}`}
                Component={
                  <Input
                    marginRight={3}
                    {...register(`rates.${index}.price`)}
                    placeholder={t(
                      'create.additionalInformation.price_info.price',
                    )}
                  />
                }
              />
              <Text
                variant={TextVariants.MUTED}
                css={`
                  margin-right: ${parseSpacing(3)};
                `}
              >
                {t('create.additionalInformation.price_info.euro')}
              </Text>
              {!isPriceFree(rate.price) && (
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
              {index !== 0 && (
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
        <Alert display="flex" marginTop={3} variant={AlertVariants.INFO}>
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
        <Alert display="flex" marginTop={3} variant={AlertVariants.WARNING}>
          {t('create.additionalInformation.price_info.uitpas_error')}
        </Alert>
      )}
      {!!duplicateNameError && (
        <Alert display="flex" marginTop={3} variant={AlertVariants.DANGER}>
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
