import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import type { Values } from '@/types/Values';
import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { Modal, ModalSizes, ModalVariants } from '@/ui/Modal';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';

const PRICE_CURRENCY = 'EUR';

const PriceCategories = {
  BASE: 'base',
  TARIFF: 'tarrif',
} as const;

type PriceCategory = Values<typeof PriceCategories>;

type Rate = {
  name: string;
  category: PriceCategory;
  price: number | null;
  priceCurrency: string;
};

type FormData = { rates: Rate[] };

const PriceInfoModal = ({ visible, onClose }: any) => {
  const { t } = useTranslation();
  const formComponent = useRef<HTMLFormElement>();
  const [errorMessage, setErrorMessage] = useState('');

  const schema = yup
    .object()
    .shape({
      rates: yup.array().of(
        yup.object({
          name: yup.string().required().max(250),
          category: yup.string(),
          price: yup.number().required(),
          priceCurrency: yup.string(),
        }),
      ),
    })
    .required();

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
          price: null,
          category: PriceCategories.BASE,
          priceCurrency: PRICE_CURRENCY,
        },
      ],
    },
  });

  const watchedRates = watch('rates');

  const handleClickAddRate = () => {
    setValue('rates', [
      ...watchedRates,
      {
        name: '',
        price: null,
        category: PriceCategories.TARIFF,
        priceCurrency: PRICE_CURRENCY,
      },
    ]);
  };

  const handleClickDeleteRate = (id: number): void => {
    setValue('rates', [...watchedRates.filter((_rate, index) => id !== index)]);
  };

  const setPriceToRate = (id: number, price: number = 0.0): void => {
    setValue('rates', [
      ...watchedRates.map((rate, index) =>
        id === index ? { ...rate, price } : rate,
      ),
    ]);
  };

  useEffect(() => {
    console.log({ errors });
    setErrorMessage('blablbala');
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
        spacing={4}
        padding={4}
        onSubmit={handleSubmit(async (data) => {
          console.log({ data });
          reset({});
        })}
        ref={formComponent}
      >
        {watchedRates.map((rate, key) => (
          <Inline key={`rate_${key}`} css="border-bottom: 1px solid grey;">
            <Inline
              width="100%"
              paddingBottom={3}
              spacing={5}
              alignItems="center"
            >
              <Inline width="33%">
                {rate.category === PriceCategories.BASE && (
                  <Text>{rate.name}</Text>
                )}
                {rate.category === PriceCategories.TARIFF && (
                  <FormElement
                    id="name"
                    placeholder="doelgroep"
                    error={
                      errors?.rates &&
                      errors?.rates[key]?.name &&
                      'error in naam'
                    }
                    Component={<Input {...register(`rates.${key}.name`)} />}
                  />
                )}
              </Inline>
              <Inline width="33%">
                <FormElement
                  id="price"
                  placeholder="prijs"
                  error={
                    errors?.rates &&
                    errors?.rates[key]?.price &&
                    'error in prijs'
                  }
                  Component={<Input {...register(`rates.${key}.price`)} />}
                />
                <Button
                  variant={ButtonVariants.LINK}
                  onClick={() => setPriceToRate(key)}
                >
                  {t('create.additionalInformation.price_info.free')}
                </Button>
              </Inline>
              <Inline width="33%">
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
        <Inline>
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
