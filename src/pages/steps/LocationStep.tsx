import { TFunction } from 'i18next';
import getConfig from 'next/config';
import { useEffect, useState } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { EventTypes } from '@/constants/EventTypes';
import { OfferTypes } from '@/constants/OfferType';
import {
  useChangeAttendanceModeMutation,
  useChangeAudienceMutation,
  useChangeLocationMutation,
  useChangeOnlineUrlMutation,
  useDeleteOnlineUrlMutation,
} from '@/hooks/api/events';
import { useGetEventByIdQuery } from '@/hooks/api/events';
import { useGetPlaceByIdQuery } from '@/hooks/api/places';
import { useChangeAddressMutation } from '@/hooks/api/places';
import { FormData as OfferFormData } from '@/pages/create/OfferForm';
import { Address } from '@/types/Address';
import { Countries, Country } from '@/types/Country';
import { AttendanceMode, AudienceType } from '@/types/Event';
import { Values } from '@/types/Values';
import { Alert } from '@/ui/Alert';
import { parseSpacing } from '@/ui/Box';
import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { LabelPositions, LabelVariants } from '@/ui/Label';
import { RadioButtonTypes } from '@/ui/RadioButton';
import { RadioButtonWithLabel } from '@/ui/RadioButtonWithLabel';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { parseOfferId } from '@/utils/parseOfferId';
import { prefixUrlWithHttp } from '@/utils/url';

import { CityPicker } from '../CityPicker';
import { Features, NewFeatureTooltip } from '../NewFeatureTooltip';
import { isValidUrl } from './AdditionalInformationStep/ContactInfoStep';
import { CountryPicker } from './CountryPicker';
import { UseEditArguments } from './hooks/useEditField';
import { PlaceStep } from './PlaceStep';
import {
  FormDataUnion,
  getStepProps,
  StepProps,
  StepsConfiguration,
} from './Steps';

const { publicRuntimeConfig } = getConfig();

const CULTUURKUUR_LOCATION_ID = publicRuntimeConfig.cultuurKuurLocationId;
const API_URL = publicRuntimeConfig.apiUrl;

const getGlobalValue = getValueFromTheme('global');

const useEditLocation = ({ scope, offerId }: UseEditArguments) => {
  const { i18n } = useTranslation();
  const changeAddressMutation = useChangeAddressMutation();
  const changeOnlineUrl = useChangeOnlineUrlMutation();
  const deleteOnlineUrl = useDeleteOnlineUrlMutation();
  const changeAttendanceMode = useChangeAttendanceModeMutation();
  const changeAudienceMutation = useChangeAudienceMutation();
  const changeLocationMutation = useChangeLocationMutation();

  return async ({ location }: FormDataUnion) => {
    // For places

    if (scope === OfferTypes.PLACES) {
      if (!location.municipality || !location.streetAndNumber) return;

      const address: Address = {
        [i18n.language]: {
          streetAddress: location.streetAndNumber,
          addressCountry: location.country,
          addressLocality: location.municipality.name,
          postalCode: location.municipality.zip,
        },
      };

      changeAddressMutation.mutate({
        id: offerId,
        address: address[i18n.language],
        language: i18n.language,
      });

      return;
    }

    // For events

    if (location.isOnline) {
      await changeAttendanceMode.mutateAsync({
        eventId: offerId,
        attendanceMode: AttendanceMode.ONLINE,
      });

      if (location.onlineUrl) {
        changeOnlineUrl.mutate({
          eventId: offerId,
          onlineUrl: location.onlineUrl,
        });
      } else {
        deleteOnlineUrl.mutate({
          eventId: offerId,
        });
      }

      return;
    }

    const isCultuurkuur = !location.country;

    if (isCultuurkuur) {
      await changeAttendanceMode.mutateAsync({
        eventId: offerId,
        attendanceMode: AttendanceMode.OFFLINE,
        location: `${API_URL}/place/${CULTUURKUUR_LOCATION_ID}`,
      });

      const changeLocationPromise = changeLocationMutation.mutateAsync({
        locationId: CULTUURKUUR_LOCATION_ID,
        eventId: offerId,
      });

      const changeAudiencePromise = changeAudienceMutation.mutateAsync({
        eventId: offerId,
        audienceType: AudienceType.EDUCATION,
      });

      await Promise.all([changeLocationPromise, changeAudiencePromise]);

      return;
    }

    if (!location.place) return;

    await changeAttendanceMode.mutateAsync({
      eventId: offerId,
      attendanceMode: AttendanceMode.OFFLINE,
      location: location.place['@id'],
    });

    if (parseOfferId(location.place['@id']) !== CULTUURKUUR_LOCATION_ID) {
      changeAudienceMutation.mutate({
        eventId: offerId,
        audienceType: AudienceType.EVERYONE,
      });
    }

    deleteOnlineUrl.mutate({
      eventId: offerId,
    });
  };
};

type PlaceStepProps = StackProps &
  StepProps & {
    terms: Array<Values<typeof EventTypes>>;
    chooseLabel: (t: TFunction) => string;
    placeholderLabel: (t: TFunction) => string;
  } & { offerId?: string };

const LocationStep = ({
  formState,
  getValues,
  reset,
  control,
  name,
  offerId,
  onChange,
  chooseLabel,
  placeholderLabel,
  watch,
  ...props
}: PlaceStepProps) => {
  const { t } = useTranslation();

  const [streetAndNumber, setStreetAndNumber] = useState('');
  const [audienceType, setAudienceType] = useState('');
  const [onlineUrl, setOnlineUrl] = useState('');
  const [hasOnlineUrlError, setHasOnlineUrlError] = useState(false);

  const [scope, locationStreetAndNumber, locationOnlineUrl, location] =
    useWatch({
      control,
      name: [
        'scope',
        'location.streetAndNumber',
        'location.onlineUrl',
        'location',
      ],
    });

  const isNameAndAgeRangeVisible =
    !!offerId ||
    !!location?.place ||
    location?.isOnline ||
    !!location?.streetAndNumber ||
    !location.country;

  const useGetOfferByIdQuery =
    scope === OfferTypes.EVENTS ? useGetEventByIdQuery : useGetPlaceByIdQuery;

  const getOfferByIdQuery = useGetOfferByIdQuery({ id: offerId });

  // @ts-expect-error
  const audience = getOfferByIdQuery.data?.audience;

  useEffect(() => {
    if (audience?.audienceType) {
      setAudienceType(audience.audienceType);
    }

    if (!locationStreetAndNumber && !locationOnlineUrl) return;

    if (locationStreetAndNumber) {
      setStreetAndNumber(locationStreetAndNumber);
    }

    if (locationOnlineUrl) {
      setOnlineUrl(locationOnlineUrl);
    }
  }, [locationStreetAndNumber, locationOnlineUrl, audience]);

  return (
    <Stack
      {...getStackProps(props)}
      minHeight={isNameAndAgeRangeVisible ? 'inherit' : '26.5rem'}
    >
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const { isOnline, municipality, country } =
            field?.value as OfferFormData['location'];

          const OnlineToggle = (
            <Inline>
              <NewFeatureTooltip featureUUID={Features.ONLINE} />
              <FormElement
                Component={
                  <RadioButtonWithLabel
                    type={RadioButtonTypes.SWITCH}
                    checked={isOnline}
                    onChange={(e) => {
                      const updatedValue = {
                        ...field.value,
                        place: undefined,
                        municipality: undefined,
                        isOnline: e.target.checked,
                      };
                      field.onChange(updatedValue);
                      field.onBlur();
                      onChange(updatedValue);
                    }}
                    css={`
                      .custom-switch {
                        font-size: 1.2rem;
                      }
                    `}
                  />
                }
                id="online-toggle"
                label={t('create.location.is_online.label')}
                labelPosition={LabelPositions.LEFT}
                labelVariant={LabelVariants.NORMAL}
              />
            </Inline>
          );

          if (isOnline) {
            return (
              <Stack spacing={4}>
                {OnlineToggle}
                <FormElement
                  Component={
                    <Input
                      maxWidth="28rem"
                      value={onlineUrl}
                      onBlur={(e) => {
                        const prefixedUrl =
                          e.target.value === ''
                            ? e.target.value
                            : prefixUrlWithHttp(e.target.value);
                        const updatedValue = {
                          ...field?.value,
                          onlineUrl: prefixedUrl,
                        };
                        field.onChange(updatedValue);
                        if (isValidUrl(prefixedUrl)) {
                          onChange(updatedValue);
                          setHasOnlineUrlError(false);
                        } else {
                          setHasOnlineUrlError(true);
                        }
                      }}
                      onChange={(e) => {
                        setOnlineUrl(e.target.value);
                      }}
                      placeholder={t('create.location.online_url.placeholder')}
                    />
                  }
                  id="online-url"
                  label={t('create.location.online_url.label')}
                  error={
                    hasOnlineUrlError &&
                    t('create.validation_messages.location.online_url')
                  }
                  info={
                    <Text
                      variant={TextVariants.MUTED}
                      maxWidth={parseSpacing(9)}
                    >
                      {t('create.location.online_url.info')}
                    </Text>
                  }
                />
              </Stack>
            );
          }

          if (!country || municipality?.zip === '0000') {
            return (
              <Stack spacing={4}>
                <Inline alignItems="center" spacing={3}>
                  <Icon
                    name={Icons.CHECK_CIRCLE}
                    color={getGlobalValue('successIcon')}
                  />
                  <Text>{t('create.location.country.location_school')}</Text>
                  <Button
                    variant={ButtonVariants.LINK}
                    onClick={() => {
                      const updatedValue = {
                        ...field.value,
                        country: Countries.BE,
                        municipality: undefined,
                      };
                      field.onChange(updatedValue);
                      onChange(updatedValue);
                      setAudienceType(AudienceType.EVERYONE);
                      field.onBlur();
                    }}
                  >
                    {t('create.location.country.change_location')}
                  </Button>
                </Inline>
                <Alert maxWidth="53rem">
                  {t('create.location.country.location_school_info')}
                </Alert>
              </Stack>
            );
          }

          if (!municipality) {
            return (
              <Stack spacing={4}>
                {scope === OfferTypes.EVENTS && OnlineToggle}
                <Inline spacing={1} alignItems="center">
                  <CityPicker
                    name="city-picker-location-step"
                    country={country}
                    offerId={offerId}
                    value={field.value?.municipality}
                    onChange={(value) => {
                      const updatedValue = {
                        ...field.value,
                        municipality: value,
                        place: undefined,
                      };
                      field.onChange(updatedValue);
                      onChange(updatedValue);
                      field.onBlur();
                    }}
                    width="22rem"
                  />
                  <CountryPicker
                    value={country}
                    includeLocationSchool={scope === OfferTypes.EVENTS}
                    onChange={(newCountry) => {
                      const updatedValue = {
                        ...field.value,
                        country: newCountry,
                      };
                      field.onChange(updatedValue);
                      onChange(updatedValue);
                      field.onBlur();
                    }}
                    css={`
                      & button {
                        margin-bottom: 0.3rem;
                      }
                    `}
                  />
                  <NewFeatureTooltip
                    featureUUID={Features.GERMAN_POSTALCODES}
                  />
                </Inline>
              </Stack>
            );
          }

          return (
            <Stack>
              <Stack spacing={4}>
                <Inline alignItems="center" spacing={3}>
                  <Icon
                    name={Icons.CHECK_CIRCLE}
                    color={getGlobalValue('successIcon')}
                  />
                  <Text>{municipality.name}</Text>
                  <Button
                    variant={ButtonVariants.LINK}
                    onClick={() => {
                      const updatedValue = {
                        ...field.value,
                        municipality: undefined,
                      };
                      field.onChange(updatedValue);
                      onChange(updatedValue);
                      field.onBlur();
                    }}
                  >
                    {t(
                      `create.location.municipality.change_${country?.toLowerCase()}`,
                    )}
                  </Button>
                </Inline>
                {scope === OfferTypes.EVENTS && (
                  <PlaceStep
                    municipality={municipality}
                    country={country}
                    chooseLabel={chooseLabel}
                    placeholderLabel={placeholderLabel}
                    {...{
                      formState,
                      getValues,
                      reset,
                      control,
                      name,
                    }}
                    {...getStepProps(props)}
                    onChange={onChange}
                  />
                )}
                {scope === OfferTypes.PLACES && (
                  <FormElement
                    Component={
                      <Input
                        value={streetAndNumber}
                        onBlur={(e) => {
                          const updatedValue = {
                            ...field.value,
                            streetAndNumber: streetAndNumber,
                          };
                          field.onChange(updatedValue);
                          onChange(updatedValue);
                        }}
                        onChange={(e) => {
                          setStreetAndNumber(e.target.value);
                        }}
                      />
                    }
                    id="location-streetAndNumber"
                    label={t('location.add_modal.labels.streetAndNumber')}
                    maxWidth="28rem"
                    error={
                      formState.errors.location?.streetAndNumber &&
                      t('location.add_modal.errors.streetAndNumber')
                    }
                  />
                )}
              </Stack>
            </Stack>
          );
        }}
      />
    </Stack>
  );
};

const locationStepConfiguration: StepsConfiguration<'location'> = {
  Component: LocationStep,
  name: 'location',
  shouldShowStep: ({ watch }) => !!watch('typeAndTheme')?.type?.id,
  title: ({ t, scope }) => t(`create.location.title.${scope}`),
  stepProps: {
    chooseLabel: (t) => t('create.location.place.choose_label'),
    placeholderLabel: (t) => t('create.location.place.placeholder'),
  },
  defaultValue: {
    isOnline: false,
    country: Countries.BE,
    place: undefined,
    streetAndNumber: undefined,
    municipality: undefined,
    onlineUrl: undefined,
  },
  validation: yup.lazy((value) => {
    if (value.place) {
      // a location for an event
      return yup
        .object()
        .shape({
          place: yup.object().shape({}).required(),
          country: yup.mixed<Country>().oneOf(Object.values(Countries)),
        })
        .required();
    }

    // an online location for a event
    if (value.isOnline) {
      return yup
        .object()
        .shape({
          onlineUrl: yup.string().url(),
        })
        .required();
    }

    // a cultuurkuur event
    if (!value.country) {
      return yup.object().shape({}).required();
    }

    // a location for a place
    return yup
      .object()
      .shape({
        streetAndNumber: yup.string().required(),
        country: yup.string().oneOf(Object.values(Countries)).required(),
      })
      .required();
  }),
};

LocationStep.defaultProps = {};

export { locationStepConfiguration, useEditLocation };
