import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { useGetOrganizersByWebsiteQuery } from '@/hooks/api/organizers';
import { useAutoFocus } from '@/hooks/useAutoFocus';
import { OrganizerData } from '@/pages/OrganizerAddModal';
import { Countries, Country } from '@/types/Country';
import { Alert, AlertVariants } from '@/ui/Alert';
import { FormElement } from '@/ui/FormElement';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { Modal, ModalSizes, ModalVariants } from '@/ui/Modal';
import { RadioButtonGroup } from '@/ui/RadioButtonGroup';
import { Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { Title } from '@/ui/Title';

import { City, CityPicker } from './CityPicker';
import {
  ContactInfo,
  ContactInfoEntry,
  emptyContactInfo,
} from './steps/ContactInfoEntry';
import { ContactInfoStep } from './steps/ContactInfoStep';

export const getValue = getValueFromTheme('organizerAddModal');

const schema = yup
  .object({
    url: yup.string().url().required(),
    name: yup.string().required(),
    address: yup
      .object({
        streetAndNumber: yup.string().required(),
        country: yup.string().oneOf(Object.values(Countries)).required(),
        city: yup
          .object({
            label: yup.string().required(),
            name: yup.string().required(),
            zip: yup.string().required(),
          })
          .required(),
      })
      .required(),
    contact: yup.array(yup.object({ type: yup.string(), value: yup.string() })),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const defaultValues: FormData = {
  url: 'https://',
  name: '',
  address: {
    country: Countries.BE,
    streetAndNumber: '',
    city: undefined,
  },
  contact: [],
};

type Props = {
  prefillName: string;
  visible: boolean;
  onConfirm: (data: FormData) => Promise<void>;
  onClose: () => void;
};

const OrganizerAddModal = ({
  visible,
  prefillName,
  onConfirm,
  onClose,
}: Props) => {
  const { t } = useTranslation();

  const [urlInputComponent] = useAutoFocus<HTMLInputElement>({
    retriggerOn: visible,
  });

  const [contactInfo, setContactInfo] = useState(emptyContactInfo);

  const {
    register,
    handleSubmit,
    formState,
    control,
    reset,
    watch,
    setValue,
    setError,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const urlRegisterProps = register('url');

  const watchedUrl = watch('url');
  const watchedCountry = watch('address.country');

  const getOrganizersByWebsiteQuery = useGetOrganizersByWebsiteQuery(
    {
      website: watchedUrl,
    },
    { enabled: visible && !formState.errors.url },
  );

  const isUrlUnique =
    // @ts-expect-error
    getOrganizersByWebsiteQuery.data?.totalItems === 0;

  const countries = useMemo(
    () => [
      {
        label: t('countries.BE'),
        value: Countries.BE,
      },
      {
        label: t('countries.NL'),
        value: Countries.NL,
      },
      // TODO: Add "Locatie in overleg met school"
    ],
    [t],
  );

  useEffect(() => {
    setValue('name', prefillName);
  }, [prefillName, setValue]);

  const handleConfirm = async () => {
    if (!isUrlUnique) {
      setError('url', { type: 'not_unique' });
      return;
    }

    await handleSubmit(async (data) => {
      await onConfirm(data);
      reset(defaultValues);
    })();
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const handleSetContactInfo = (contactInfo: ContactInfo) => {
    const organizerContactInfo = [];

    Object.keys(contactInfo).map((key, index) => {
      contactInfo[key].map((value: string) => {
        organizerContactInfo.push({
          type: key,
          value,
        });
      });
    });

    setContactInfo(contactInfo);

    setValue('contact', organizerContactInfo);
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
            spacing={3}
            css={`
              border: 1px solid ${getValue('address.borderColor')};
            `}
          >
            <Stack>
              <Controller<OrganizerData>
                control={control}
                name="address.country"
                render={({ field }) => (
                  <FormElement
                    Component={
                      <RadioButtonGroup
                        name="country"
                        items={countries}
                        selected={
                          field.value as OrganizerData['address']['country']
                        }
                        onChange={field.onChange}
                      />
                    }
                    id="organizer-address-country"
                    label={t('organizer.add_modal.labels.address.country')}
                  />
                )}
              />
            </Stack>
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
            <Inline spacing={4}>
              <Stack minWidth="20rem" maxWidth="25rem">
                <Controller<OrganizerData>
                  control={control}
                  name="address.city"
                  render={({ field }) => {
                    return (
                      <CityPicker
                        country={watchedCountry as Country}
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
              {watchedCountry === 'NL' && (
                <FormElement
                  Component={<Input {...register('address.city.zip')} />}
                  id="organizer-address-city-zip"
                  label={t('organizer.add_modal.labels.address.zip')}
                  info={t('organizer.add_modal.info.zip')}
                  error={
                    formState.errors.address?.city?.zip &&
                    t(
                      'organizer.add_modal.validation_messages.address.city.zip',
                    )
                  }
                />
              )}
            </Inline>
          </Stack>
        </Stack>
        <Stack spacing={2}>
          <Title size={2}>Contact</Title>
          <ContactInfoStep
            isOrganizer={true}
            onSuccessfulChange={handleSetContactInfo}
            organizerContactInfo={contactInfo}
          />
        </Stack>
      </Stack>
    </Modal>
  );
};

export { OrganizerAddModal };
export type { FormData as OrganizerData };
