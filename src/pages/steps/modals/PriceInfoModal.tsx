import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { Modal, ModalSizes, ModalVariants } from '@/ui/Modal';
import { Stack } from '@/ui/Stack';

type Rate = {
  targetGroup: string;
  price: number | null;
};

type FormData = Rate[];

const PriceInfoModal = ({ visible, onClose }: any) => {
  const { t } = useTranslation();

  const { register } = useForm<FormData>();

  const [rates, setRates] = useState<Rate[]>([
    { targetGroup: 'base', price: null },
  ]);

  const handleClickAddRate = () => {
    setRates([
      ...rates,
      {
        targetGroup: '',
        price: null,
      },
    ]);
  };

  const handleClickDeleteRate = (id: number): void => {
    setRates([...rates.filter((_value, index) => id !== index)]);
  };

  return (
    <Modal
      title={t('create.additionalInformation.price_info.title')}
      visible={visible}
      variant={ModalVariants.QUESTION}
      onClose={onClose}
      confirmTitle={t('create.additionalInformation.price_info.save')}
      cancelTitle={t('create.additionalInformation.price_info.close')}
      size={ModalSizes.LG}
      onConfirm={() => console.log('close')}
      confirmButtonDisabled={false}
    >
      <Stack as="form" spacing={4} padding={4}>
        {rates.map((rate, key) => (
          <Inline
            spacing={5}
            key={`rate_${key}`}
            css="border-bottom: 1px solid grey;"
            alignItems="center"
          >
            <FormElement
              id="targetGroup"
              placeholder="doelgroep"
              error="error"
              Component={<Input {...register('targetGroup')} />}
            />
            <FormElement
              id="price"
              placeholder="prijs"
              error="error"
              Component={<Input {...register('price')} />}
            />
            <Button
              onClick={() => console.log('set free')}
              variant={ButtonVariants.LINK}
            >
              {t('create.additionalInformation.price_info.free')}
            </Button>
            {key !== 0 && (
              <Button
                onClick={() => handleClickDeleteRate(key)}
                variant={ButtonVariants.UNSTYLED}
              >
                <Icon name={Icons.TIMES} />
              </Button>
            )}
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
