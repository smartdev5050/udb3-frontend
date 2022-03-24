import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

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

const PRICE_CURRENCY = 'EUR';

const PriceCategories = {
  BASE: 'base',
  TARIFF: 'tarrif',
} as const;

type PriceCategory = Values<typeof PriceCategories>;

type Rate = {
  name: string;
  category: PriceCategory;
  price: string;
  priceCurrency: string;
};

type FormData = { rates: Rate[] };

type PriceInfoModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmitValid: (data: FormData) => Promise<void>;
};

const isNotUitpas = (value: string): boolean => {
  return value.toLowerCase() !== 'uitpas';
};

const priceRegex: RegExp = /^([1-9][0-9]*|[0-9]|[0])(,[0-9]{1,2})?$/;

const schema = yup
  .object()
  .shape({
    rates: yup.array().of(
      yup.object({
        name: yup
          .string()
          .test(`name-is-not-uitpas`, 'should not be uitpas', isNotUitpas)
          .required()
          .max(250),
        category: yup.string(),
        price: yup.string().matches(priceRegex).required(),
        priceCurrency: yup.string(),
      }),
    ),
  })
  .required();

const PriceInfoModal = ({
  visible,
  onClose,
  onSubmitValid,
}: PriceInfoModalProps) => {
  const { t } = useTranslation();
  const formComponent = useRef<HTMLFormElement>();
  const [hasGlobalError, setHasGlobalError] = useState(false);
  const [hasUitpasError, setHasUitpasError] = useState(false);

  const {
    register,
    watch,
    setValue,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      rates: [
        {
          name: 'Basistarief',
          price: '',
          category: PriceCategories.BASE,
          priceCurrency: PRICE_CURRENCY,
        },
      ],
    },
  });

  const watchedRates = watch('rates') ?? [];

  const handleClickAddRate = () => {
    setValue('rates', [
      ...watchedRates,
      {
        name: '',
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
    return price === '0' || price === '0,0' || price === '0,00';
  };

  useEffect(() => {
    const errorRates = (errors.rates || []).filter(
      (error: any) => error !== undefined,
    );
    const hasGlobalError = errorRates.length > 0;
    const hasUitpasError = errorRates.some(
      (error) => error.name?.type === 'name-is-not-uitpas',
    );

    setHasGlobalError(hasGlobalError && !hasUitpasError);
    setHasUitpasError(hasUitpasError);
  }, [errors]);

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
        {watchedRates.map((rate, key) => (
          <Inline
            key={`rate_${key}`}
            paddingTop={3}
            paddingBottom={3}
            css="border-bottom: 1px solid #ddd;"
          >
            <Inline width="100%" alignItems="center">
              <Inline width="30%">
                {rate.category === PriceCategories.BASE && (
                  <Text>{rate.name}</Text>
                )}
                {rate.category === PriceCategories.TARIFF && (
                  <FormElement
                    id="name"
                    Component={
                      <Input
                        {...register(`rates.${key}.name`)}
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
                      {...register(`rates.${key}.price`)}
                      placeholder={t(
                        'create.additionalInformation.price_info.price',
                      )}
                    />
                  }
                />
                <Text variant={TextVariants.MUTED}>euro</Text>
                {!isPriceFree(rate.price) && (
                  <Button
                    variant={ButtonVariants.LINK}
                    onClick={() => setPriceToRate(key)}
                  >
                    {t('create.additionalInformation.price_info.free')}
                  </Button>
                )}
              </Inline>
              <Inline width="30%" justifyContent="flex-end">
                {key !== 0 && (
                  <Button
                    iconName={Icons.TRASH}
                    spacing={3}
                    variant={ButtonVariants.DANGER}
                    onClick={() => handleClickDeleteRate(key)}
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

export { PriceInfoModal };
export type { FormData };
