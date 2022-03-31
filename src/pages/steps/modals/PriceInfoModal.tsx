import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import i18n from '@/i18n/index';
import type { Values } from '@/types/Values';
import { Alert, AlertVariants } from '@/ui/Alert';
import { Box, parseSpacing } from '@/ui/Box';
import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { Modal, ModalSizes, ModalVariants } from '@/ui/Modal';
import { Stack } from '@/ui/Stack';
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

type PriceInfoModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmitValid: (data: FormData) => Promise<void>;
  priceInfo: Rate[];
};

const getValue = getValueFromTheme('priceInfoModal');

const isNotUitpas = (value: any): boolean => {
  return value[i18n.language].toLowerCase() !== 'uitpas';
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

const PriceInfoModal = ({
  visible,
  onClose,
  onSubmitValid,
  priceInfo,
}: PriceInfoModalProps) => {
  const { t, i18n } = useTranslation();
  const formComponent = useRef<HTMLFormElement>();
  const [hasGlobalError, setHasGlobalError] = useState(false);
  const [hasUitpasError, setHasUitpasError] = useState(false);

  const {
    register,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
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
    },
  });

  useEffect(() => {
    if (!priceInfo?.length) return;
    setValue('rates', [...priceInfo]);
  }, [priceInfo]);

  const watchedRates = watch('rates');

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

  const handleClickDeleteRate = (id: number): void => {
    setValue('rates', [...watchedRates.filter((_rate, index) => id !== index)]);
  };

  const setPriceToRate = (id: number, price: string = '0,00'): void => {
    setValue('rates', [
      ...watchedRates.map((rate, index) =>
        id === index ? { ...rate, price } : rate,
      ),
    ]);
  };

  const isPriceFree = (price: string): boolean => {
    return ['0', '0,0', '0,00'].includes(price);
  };

  useEffect(() => {
    const errorRates = (errors.rates || []).filter(
      (error: any) => error !== undefined,
    );

    const hasGlobalError = errorRates.length > 0;
    const hasUitpasError = errorRates.some(
      // @ts-expect-error
      (error) => error.name?.type === 'name-is-not-uitpas',
    );

    setHasGlobalError(hasGlobalError && !hasUitpasError);
    setHasUitpasError(hasUitpasError);
  }, [errors, i18n.language]);

  return (
    <Modal
      title={t('create.additionalInformation.price_info.title')}
      visible={visible}
      variant={ModalVariants.QUESTION}
      onClose={onClose}
      confirmTitle={t('create.additionalInformation.price_info.save')}
      cancelTitle={t('create.additionalInformation.price_info.close')}
      size={ModalSizes.LG}
      onConfirm={() => {
        formComponent.current.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true }),
        );
      }}
      confirmButtonDisabled={false}
    >
      <Stack
        as="form"
        padding={4}
        onSubmit={handleSubmit(async (data) => {
          await onSubmitValid(data);
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
                    id="name"
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
                  id="price"
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
                    onClick={() => setPriceToRate(index)}
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
          <Alert marginTop={3} variant={AlertVariants.INFO}>
            <Box
              forwardedAs="div"
              dangerouslySetInnerHTML={{
                __html: t(
                  'create.additionalInformation.price_info.global_error',
                ),
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
        <Inline marginTop={3}>
          <Button
            onClick={handleClickAddRate}
            variant={ButtonVariants.SECONDARY}
          >
            {t('create.additionalInformation.price_info.add')}
          </Button>
        </Inline>
      </Stack>
    </Modal>
  );
};

export { PriceCategories, PriceInfoModal };
export type { FormData, Rate };
