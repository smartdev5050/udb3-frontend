import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
import { Controller, Path, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { useAutoFocus } from '@/hooks/useAutoFocus';
import { OrganizerData } from '@/pages/OrganizerAddModal';
import { Alert, AlertVariants } from '@/ui/Alert';
import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Icon, Icons } from '@/ui/Icon';
import { Input } from '@/ui/Input';
import { List } from '@/ui/List';
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
        phone: yup.array().of(yup.string()),
        email: yup.array().of(yup.string().email()),
        url: yup.array().of(yup.string().url()),
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

const contactPointConfig = {
  email: {
    addLabel: 'Email toevoegen',
  },
  phone: {
    addLabel: 'Telefoonnummer toevoegen',
  },
  url: {
    addLabel: 'Website toevoegen',
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
    trigger,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const websiteRegisterProps = register('website');

  const watchedWebsite = useWatch({ control, name: 'website' });
  const watchedContactPoint = useWatch({ control, name: 'contactPoint' });

  const contactPoints = useMemo(() => {
    const uniqueContactPoints = Object.values(watchedContactPoint).reduce(
      (acc, current) => {
        return [...acc, ...current];
      },
      [],
    );

    if (formState.dirtyFields.website && !formState.errors.website) {
      uniqueContactPoints.push(watchedWebsite);
    }

    return [...new Set(uniqueContactPoints)];
  }, [
    formState.errors.website,
    formState.dirtyFields.website,
    watchedContactPoint,
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
          <List>
            {contactPoints.map((cp) => (
              <List.Item key={cp}>
                <Text>{cp}</Text>
                <Button variant={ButtonVariants.UNSTYLED} onClick={() => {}}>
                  <Icon
                    name={Icons.TIMES}
                    opacity={{ default: 0.5, hover: 1 }}
                  />
                </Button>
              </List.Item>
            ))}
          </List>
          {Object.keys(contactPointConfig).map(
            (name: keyof typeof contactPointConfig) => (
              <ContactPoint
                key={name}
                name={name}
                onAdd={(value) => {
                  setValue(`contactPoint.${name}`, [
                    ...watchedContactPoint[name],
                    value,
                  ]);
                }}
                {...contactPointConfig[name]}
              />
            ),
          )}
        </Stack>
      </Stack>
    </Modal>
  );
};

export { OrganizerAddModal };
export type { FormData as OrganizerData };
