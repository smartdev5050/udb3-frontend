import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { useAutoFocus } from '@/hooks/useAutoFocus';
import { OrganizerData } from '@/pages/OrganizerAddModal';
import { Alert, AlertVariants } from '@/ui/Alert';
import { FormElement } from '@/ui/FormElement';
import { Input } from '@/ui/Input';
import { Modal, ModalSizes, ModalVariants } from '@/ui/Modal';
import { Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { Title } from '@/ui/Title';

import { City, CityPicker } from './CityPicker';

export const getValue = getValueFromTheme('organizerAddModal');

const schema = yup
  .object({
    url: yup.string().url().required(),
    name: yup.string().required(),
    address: yup
      .object({
        streetAndNumber: yup.string().required(),
        country: yup.string().oneOf(['BE', 'NL']).required(),
        city: yup
          .object({
            label: yup.string().required(),
            name: yup.string().required(),
            zip: yup.string().required(),
          })
          .required(),
      })
      .required(),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const defaultValues: FormData = {
  url: 'https://',
  name: '',
  address: {
    country: 'BE',
    streetAndNumber: '',
    city: undefined,
  },
};

type Props = {
  prefillName: string;
  visible: boolean;
  onConfirm: (data: FormData) => void;
  onClose: () => void;
};

const OrganizerAddModal = ({
  visible,
  prefillName,
  onConfirm,
  onClose,
}: Props) => {
  const { t } = useTranslation();

  const [urlInputComponent] = useAutoFocus({
    retriggerOn: visible,
  });

  const {
    register,
    handleSubmit,
    formState,
    control,
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const urlRegisterProps = register('url');

  useEffect(() => {
    setValue('name', prefillName);
  }, [prefillName, setValue]);

  const handleConfirm = async () => {
    await handleSubmit((data) => {
      onConfirm(data);
      reset(defaultValues);
    })();
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  return (
    <Modal
      title={t('organizer.add_modal.title')}
      confirmTitle={t('organizer.add_modal.actions.add')}
      cancelTitle={t('organizer.add_modal.actions.cancel')}
      visible={visible}
      variant={ModalVariants.QUESTION}
      onConfirm={handleConfirm}
      onClose={handleClose}
      size={ModalSizes.LG}
      scrollable={false}
    >
      <Stack padding={4} spacing={4}>
        <FormElement
          Component={
            <Input
              {...urlRegisterProps}
              ref={(element: HTMLInputElement) => {
                urlRegisterProps.ref(element);
                urlInputComponent.current = element;
              }}
            />
          }
          id="organizer-url"
          label={t('organizer.add_modal.labels.url')}
          info={
            <Alert variant={AlertVariants.INFO}>
              {t('organizer.add_modal.url_requirements')}
            </Alert>
          }
          error={
            formState.errors.url &&
            t('organizer.add_modal.validation_messages.url')
          }
        />
        <FormElement
          Component={<Input {...register('name')} />}
          id="organizer-name"
          label={t('organizer.add_modal.labels.name.title')}
          error={
            formState.errors.name &&
            t('organizer.add_modal.validation_messages.name')
          }
          info={
            <Text variant={TextVariants.MUTED}>
              {t('organizer.add_modal.labels.name.info')}
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
              name="address.city"
              render={({ field }) => {
                return (
                  <CityPicker
                    {...field}
                    value={field.value as City}
                    error={
                      formState.errors.address?.city &&
                      t(
                        'organizer.add_modal.validation_messages.address.addressLocality',
                      )
                    }
                  />
                );
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
