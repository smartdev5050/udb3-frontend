import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { ScopeTypes } from '@/constants/OfferType';
import { useGetOrganizersByWebsiteQuery } from '@/hooks/api/organizers';
import { useAutoFocus } from '@/hooks/useAutoFocus';
import { SupportedLanguage } from '@/i18n/index';
import { OrganizerData } from '@/pages/OrganizerAddModal';
import {
  ContactInfo,
  ContactInfoStep,
} from '@/pages/steps/AdditionalInformationStep/ContactInfoStep';
import { Countries, Country } from '@/types/Country';
import { Organizer } from '@/types/Organizer';
import { Alert, AlertVariants } from '@/ui/Alert';
import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { LabelPositions, LabelVariants } from '@/ui/Label';
import { Modal, ModalSizes, ModalVariants } from '@/ui/Modal';
import { RadioButton, RadioButtonTypes } from '@/ui/RadioButton';
import { RadioButtonGroup } from '@/ui/RadioButtonGroup';
import { Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { Title } from '@/ui/Title';
import { getLanguageObjectOrFallback } from '@/utils/getLanguageObjectOrFallback';

import { City, CityPicker } from './CityPicker';
import { DUTCH_ZIP_REGEX, GERMAN_ZIP_REGEX } from './steps/LocationStep';

const getValue = getValueFromTheme('organizerAddModal');

const schema = yup
  .object({
    url: yup.string().url().required(),
    name: yup.string().required(),
    address: yup.object({
      streetAndNumber: yup.string(),
      country: yup.mixed<Country>().oneOf(Object.values(Countries)),
      city: yup
        .object({
          label: yup.string(),
          name: yup.string(),
          zip: yup.string(),
        })
        .when('country', {
          is: (country) => country === Countries.DE,
          then: yup.object({
            label: yup.string(),
            name: yup.string(),
            zip: yup.string().matches(GERMAN_ZIP_REGEX),
          }),
        })
        .when('country', {
          is: (country) => country === Countries.NL,
          then: yup.object({
            label: yup.string(),
            name: yup.string(),
            zip: yup.string().matches(DUTCH_ZIP_REGEX),
          }),
        })
        .when('country', {
          is: (country) => country === Countries.BE,
          then: yup.object({
            label: yup.string(),
            name: yup.string(),
            zip: yup.string(),
          }),
        }),
    }),
    contact: yup.array(yup.object({ type: yup.string(), value: yup.string() })),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const defaultValues: FormData = {
  url: 'https://',
  name: '',
  address: {
    country: Countries.BE,
    streetAndNumber: undefined,
    city: undefined,
  },
  contact: [],
};

type Props = {
  prefillName: string;
  visible: boolean;
  onConfirm: (data: FormData) => Promise<void>;
  onClose: () => void;
  onSetOrganizer: (organizer: Organizer) => void;
};

const OrganizerAddModal = ({
  visible,
  prefillName,
  onConfirm,
  onClose,
  onSetOrganizer,
}: Props) => {
  const { t, i18n } = useTranslation();

  const [urlInputComponent] = useAutoFocus<HTMLInputElement>({
    retriggerOn: visible,
  });

  const [isContactUrl, setIsContactUrl] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    email: [],
    phone: [],
    url: [],
  });

  const formComponent = useRef<HTMLFormElement>();

  const {
    register,
    handleSubmit,
    formState,
    control,
    reset,
    watch,
    clearErrors,
    setValue,
    setError,
    getValues,
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    reValidateMode: 'onBlur',
    defaultValues,
  });

  const urlRegisterProps = register('url');

  const [watchedUrl, watchedCountry] = useWatch({
    control,
    name: ['url', 'address.country'],
  });

  const getOrganizersByWebsiteQuery = useGetOrganizersByWebsiteQuery(
    {
      website: watchedUrl,
    },
    { enabled: visible },
  );

  const existingOrganizer: Organizer | undefined =
    // @ts-expect-error
    getOrganizersByWebsiteQuery.data?.member?.[0];
  const isUrlUnique = !existingOrganizer;
  const isUrlAlreadyTaken = formState.errors.url?.type === 'not_unique';

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
      {
        label: t('countries.DE'),
        value: Countries.DE,
      },
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
    if (!contactInfo.url.includes(getValues('url'))) {
      setIsContactUrl(false);
    }

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
      <Stack as="form" ref={formComponent} padding={4} spacing={4}>
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
            <>
              {isUrlAlreadyTaken ? (
                <Alert variant={AlertVariants.WARNING}>
                  <Trans
                    i18nKey={`organizer.add_modal.validation_messages.url_not_unique`}
                    values={{
                      organizerName: getLanguageObjectOrFallback(
                        existingOrganizer?.name,
                        i18n.language as SupportedLanguage,
                        existingOrganizer.mainLanguage as SupportedLanguage,
                      ),
                    }}
                    components={{
                      setOrganizerLink: (
                        <Button
                          variant={ButtonVariants.UNSTYLED}
                          onClick={() => onSetOrganizer(existingOrganizer)}
                          display={'inline-block'}
                          fontWeight={'bold'}
                          textDecoration={'underline'}
                          padding={0}
                        />
                      ),
                    }}
                  />
                </Alert>
              ) : (
                <Alert variant={AlertVariants.PRIMARY}>
                  {t('organizer.add_modal.url_requirements')}
                </Alert>
              )}
              <FormElement
                id={'isContactUrl'}
                label={t('organizers.create.step1.is_contact_url')}
                labelVariant={LabelVariants.NORMAL}
                labelPosition={LabelPositions.RIGHT}
                Component={
                  <RadioButton
                    type={RadioButtonTypes.SWITCH}
                    checked={isContactUrl}
                    onChange={() => {
                      setIsContactUrl(!isContactUrl);
                      const contactUrl = getValues('url');
                      if (!contactUrl) {
                        return;
                      }

                      const url = new Set(
                        isContactUrl
                          ? contactInfo.url.filter(
                              (previousContactUrl) =>
                                previousContactUrl !== contactUrl,
                            )
                          : [...contactInfo.url, contactUrl],
                      );

                      handleSetContactInfo({
                        ...contactInfo,
                        url: [...url],
                      });
                    }}
                  />
                }
              />
            </>
          }
          error={
            !isUrlAlreadyTaken &&
            formState.errors.url &&
            t(`organizer.add_modal.validation_messages.url`)
          }
        />
        <FormElement
          maxLength={90}
          Component={<Input {...register('name')} value={watch('name')} />}
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
                        onChange={(e) => {
                          setValue('address.city', {
                            name: '',
                            zip: '',
                            label: '',
                          });
                          clearErrors('address');
                          field.onChange(e.target.value);
                        }}
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
                          formState.errors.address?.city?.label &&
                          t(
                            'organizer.add_modal.validation_messages.address.addressLocality',
                          )
                        }
                      />
                    );
                  }}
                />
              </Stack>
              {(watchedCountry === Countries.NL ||
                watchedCountry === Countries.DE) && (
                <FormElement
                  Component={<Input {...register('address.city.zip')} />}
                  id="organizer-address-city-zip"
                  label={t('organizer.add_modal.labels.address.zip')}
                  info={t(
                    `organizer.add_modal.info.zip.${watchedCountry.toLowerCase()}`,
                  )}
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
            scope={ScopeTypes.ORGANIZERS}
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
