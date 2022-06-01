import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
import { Controller, Path, useForm } from 'react-hook-form';
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

import { ContactPoint } from './ContactPoint';
import { MunicipalityPicker } from './MunicipalityPicker';

export const getValue = getValueFromTheme('organizerAddModal');

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
    contactPoint: yup
      .object({
        phone: yup.array(yup.string()),
        email: yup.array(yup.string()),
        url: yup.array(yup.string()),
      })
      .required(),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const defaultValues: FormData = {
  website: 'https://',
  name: '',
  address: {
    addressLocality: '',
    streetAndNumber: '',
  },
  contactPoint: {
    email: [],
    phone: [],
    url: [],
  },
};

type ContactPointConfig = Partial<
  Record<
    Path<FormData>,
    {
      isExpanded: boolean;
      addLabel: string;
    }
  >
>;

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

  const [reference] = useAutoFocus({
    retriggerOn: visible,
  });

  const {
    register,
    handleSubmit,
    formState,
    control,
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const websiteRegisterProps = register('website');

  const watchedWebsite = watch('website');
  const watchedContactPoint = watch('contactPoint');

  const [
    contactPointConfig,
    setContactPointConfig,
  ] = useState<ContactPointConfig>({
    'contactPoint.email': {
      isExpanded: false,
      addLabel: 'Email toevoegen',
    },
    'contactPoint.phone': {
      isExpanded: false,
      addLabel: 'Telefoonnummer toevoegen',
    },
    'contactPoint.url': {
      isExpanded: false,
      addLabel: 'Website toevoegen',
    },
  });

  const contactPoints = useMemo(() => {
    const uniqueContactPoints = new Set(
      Object.values(watchedContactPoint).flat(),
    );

    if (formState.dirtyFields.website && !formState.errors.website) {
      uniqueContactPoints.add(watchedWebsite);
    }

    return [...uniqueContactPoints];
  }, [
    watchedContactPoint,
    formState.dirtyFields.website,
    formState.errors.website,
    watchedWebsite,
  ]);

  useEffect(() => {
    setValue('name', prefillName);
  }, [prefillName, setValue]);

  const handleConfirm = async () => {
    await handleSubmit((data) => {
      onConfirm(data);
    })();
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const handleCancelAddContactPoint = (name: Path<FormData>) =>
    setContactPointConfig((prevConfig) => ({
      ...prevConfig,
      [name]: { ...prevConfig[name], isExpanded: false },
    }));

  const handleExpandContactPoint = (name: Path<FormData>) =>
    setContactPointConfig((prevConfig) => ({
      ...prevConfig,
      [name]: { ...prevConfig[name], isExpanded: true },
    }));

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
      // scrollable={false}
    >
      <Stack padding={4} spacing={4}>
        <FormElement
          Component={
            <Input
              {...websiteRegisterProps}
              ref={(element: HTMLInputElement) => {
                websiteRegisterProps.ref(element);
                reference.current = element;
              }}
            />
          }
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
                return (
                  <MunicipalityPicker
                    {...field}
                    value={field.value as string}
                    error={
                      formState.errors.address?.addressLocality &&
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
        <Stack spacing={2}>
          <Title size={3}>
            {t('organizer.add_modal.labels.contactPoint.title')}
          </Title>
          <Text>{JSON.stringify(contactPoints)}</Text>
          {Object.keys(contactPointConfig).map((name: Path<FormData>) => (
            <ContactPoint
              key={name}
              name={name}
              register={register}
              formState={formState}
              onAdd={handleSubmit}
              onCancel={() => handleCancelAddContactPoint(name)}
              onExpand={() => handleExpandContactPoint(name)}
              {...contactPointConfig[name]}
            />
          ))}
        </Stack>
      </Stack>
    </Modal>
  );
};

export { OrganizerAddModal };
export type { FormData as OrganizerData };
