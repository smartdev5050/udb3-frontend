import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { OrganizerData } from '@/pages/OrganizerAddModal';
import { Alert, AlertVariants } from '@/ui/Alert';
import { FormElement } from '@/ui/FormElement';
import { Input } from '@/ui/Input';
import { Modal, ModalSizes, ModalVariants } from '@/ui/Modal';
import { Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { Title } from '@/ui/Title';

import { CityPicker } from './CityPicker';

const getValue = getValueFromTheme('organizerAddModal');

type Props = {
  visible: boolean;
  onConfirm: (data: FormData) => void;
  onClose: () => void;
};

const schema = yup
  .object({
    website: yup.string().url().required(),
    name: yup.string().required(),
    address: yup
      .object({
        streetAndNumber: yup.string().required(),
        addressLocality: yup.string().required(),
      })
      .required(),
    contact: yup.object({}).required(),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const OrganizerAddModal = ({ visible, onConfirm, onClose }: Props) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState,
    control,
    reset,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      address: {
        addressLocality: '',
        streetAndNumber: '',
      },
    },
  });

  const watchedAddressLocality = watch('address.addressLocality');

  console.log('watchedAddressLocality', { watchedAddressLocality });

  const handleConfirm = async () => {
    await handleSubmit((data) => {
      onConfirm(data);
    })();
  };

  return (
    <Modal
      title={t('organizer.add_modal.title')}
      confirmTitle={t('organizer.add_modal.actions.add')}
      cancelTitle={t('organizer.add_modal.actions.cancel')}
      visible={visible}
      variant={ModalVariants.QUESTION}
      onConfirm={handleConfirm}
      onClose={onClose}
      size={ModalSizes.LG}
    >
      <Stack padding={4} spacing={4}>
        <FormElement
          Component={<Input {...register('website')} />}
          id="organizer-website"
          label={t('organizer.add_modal.labels.website')}
          info={
            <Alert variant={AlertVariants.INFO}>
              {t('organizer.add_modal.website_requirements')}
            </Alert>
          }
          error={
            formState.errors.website &&
            t('organizer.add_modal.validation_messages.website')
          }
        />
        <FormElement
          Component={<Input {...register('name')} />}
          id="organizer-name"
          label={t('organizer.add_modal.labels.name')}
          error={
            formState.errors.name &&
            t('organizer.add_modal.validation_messages.name')
          }
          info={
            <Text variant={TextVariants.MUTED}>
              De officiële publieke naam van de organisatie
            </Text>
          }
        />
        <Stack spacing={2}>
          <Title size={3}>
            {t('organizer.add_modal.labels.address.title')}
          </Title>
          <Stack
            padding={4}
            css={`
              border: 1px solid ${getValue('address.borderColor')};
            `}
          >
            <FormElement
              Component={<Input {...register('address.streetAndNumber')} />}
              id="organizer-address-streetAndNumber"
              label={t('organizer.add_modal.labels.address.streetAndNumber')}
              error={
                formState.errors.address?.streetAndNumber &&
                t(
                  'organizer.add_modal.validation_messages.address.streetAndNumber',
                )
              }
            />
            <Controller<OrganizerData>
              control={control}
              name="address.addressLocality"
              render={({ field }) => {
                return <CityPicker {...field} value={field.value as string} />;
              }}
            />
          </Stack>
        </Stack>
      </Stack>
    </Modal>
  );
};

export { OrganizerAddModal };
export type { FormData as OrganizerData };
