import { TFunction } from 'i18next';
import { uniqBy } from 'lodash';
import getConfig from 'next/config';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
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
  useGetEventByIdQuery,
} from '@/hooks/api/events';
import { useGetOffersByCreatorQuery } from '@/hooks/api/offers';
import {
  useChangeAddressMutation,
  useGetPlaceByIdQuery,
} from '@/hooks/api/places';
import { useGetUserQuery } from '@/hooks/api/user';
import { FormData as OfferFormData } from '@/pages/create/OfferForm';
import { Address } from '@/types/Address';
import { Countries, Country } from '@/types/Country';
import { AttendanceMode, AudienceType } from '@/types/Event';
import { Offer } from '@/types/Offer';
import { Values } from '@/types/Values';
import { Alert, AlertVariants } from '@/ui/Alert';
import { parseSpacing } from '@/ui/Box';
import { Button, ButtonVariants } from '@/ui/Button';
import { ButtonCard } from '@/ui/ButtonCard';
import { FormElement } from '@/ui/FormElement';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { LabelPositions, LabelVariants } from '@/ui/Label';
import { RadioButtonTypes } from '@/ui/RadioButton';
import { RadioButtonWithLabel } from '@/ui/RadioButtonWithLabel';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { Breakpoints, getValueFromTheme } from '@/ui/theme';
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

const RecentLocations = ({ onFieldChange, ...props }) => {
  const { t } = useTranslation();
  const getUserQuery = useGetUserQuery();
  const getOffersQuery = useGetOffersByCreatorQuery(
    {
      advancedQuery: '_exists_:location.id',
      creator: getUserQuery?.data,
      sortOptions: {
        field: 'modified',
        order: 'desc',
      },
      paginationOptions: { start: 0, limit: 20 },
    },
    {
      queryArguments: {
        workflowStatus: 'DRAFT,READY_FOR_VALIDATION,APPROVED',
        addressCountry: '*',
      },
    },
  );

  const offers: Offer[] = getOffersQuery?.data?.member ?? [];
  const locations = uniqBy(
    offers?.map((offer) => offer.location),
    '@id',
  ).filter((location) => location && location.name.nl !== 'Online');

  return (
    <Stack {...props}>
      <Inline>
        <Text fontWeight={'bold'}>
          {t('create.location.recent_locations.title')}
        </Text>
        <NewFeatureTooltip featureUUID={Features.SUGGESTED_ORGANIZERS} />
      </Inline>
      <Alert variant={AlertVariants.PRIMARY} marginY={4}>
        {t('create.location.recent_locations.info')}
      </Alert>
      <Inline spacing={4} justifyContent="flex-start" flexWrap="wrap">
        {locations.map((location) => {
          const address =
            location.address[location.mainLanguage] ?? location.address;

          return (
            <ButtonCard
              onClick={() =>
                onFieldChange({
                  municipality: {
                    zip: address.postalCode,
                    label: `${address.postalCode} ${address.addressLocality}`,
                    name: address.addressLocality,
                  },
                  place: location,
                })
              }
              key={location['@id']}
              title={location.name['nl']}
              description={
                address && (
                  <>
                    {address.streetAddress}
                    <br />
                    {address.postalCode} {address.addressLocality}
                  </>
                )
              }
            />
          );
        })}
      </Inline>
    </Stack>
  );
};

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
  setValue,
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

  const shouldAddSpaceBelowTypeahead = useMemo(() => {
    if (offerId || location?.isOnline) return false;

    if (
      scope === OfferTypes.PLACES &&
      (!location?.municipality?.name ||
        !formState.touchedFields.location?.streetAndNumber)
    ) {
      return true;
    }

    if (
      scope === OfferTypes.EVENTS &&
      (!location?.municipality?.name || !location?.place)
    ) {
      return true;
    }

    return false;
  }, [
    formState.touchedFields.location?.streetAndNumber,
    location?.isOnline,
    location?.municipality?.name,
    location?.place,
    offerId,
    scope,
  ]);

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

  const handleChangeStreetAndNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const shouldShowNextStepInCreate =
      !offerId &&
      !formState.touchedFields.location?.streetAndNumber &&
      e.target.value.trim().length >= 2;

    if (shouldShowNextStepInCreate) {
      setValue('location.streetAndNumber', undefined, {
        shouldTouch: true,
      });
    }

    setStreetAndNumber(e.target.value);
  };

  return (
    <Stack
      {...getStackProps(props)}
      minHeight={shouldAddSpaceBelowTypeahead ? '26.5rem' : 'inherit'}
    >
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const { isOnline, municipality, country } =
            field?.value as OfferFormData['location'];

          const onFieldChange = (updatedValue) => {
            updatedValue = { ...field.value, ...updatedValue };
            field.onChange(updatedValue);
            onChange(updatedValue);
            field.onBlur();
          };

          const renderFieldWithRecentLocations = (children) => (
            <Inline
              spacing={4}
              stackOn={Breakpoints.S}
              alignItems={'flex-start'}
              width={'100%'}
            >
              {!isOnline && (
                <RecentLocations flex={1} onFieldChange={onFieldChange} />
              )}
              <Stack spacing={4} flex={1}>
                {!isOnline && (
                  <Text fontWeight={'bold'}>
                    {t('create.location.recent_locations.other')}
                  </Text>
                )}
                {children}
              </Stack>
            </Inline>
          );

          const OnlineToggle = (
            <Inline>
              <NewFeatureTooltip featureUUID={Features.ONLINE} />
              <FormElement
                Component={
                  <RadioButtonWithLabel
                    type={RadioButtonTypes.SWITCH}
                    checked={isOnline}
                    onChange={(e) => {
                      onFieldChange({
                        place: undefined,
                        municipality: undefined,
                        isOnline: e.target.checked,
                      });
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
                {renderFieldWithRecentLocations(
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
                        placeholder={t(
                          'create.location.online_url.placeholder',
                        )}
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
                  />,
                )}
              </Stack>
            );
          }

          if (!country || municipality?.zip === '0000') {
            return renderFieldWithRecentLocations(
              <>
                <Inline alignItems="center" spacing={3}>
                  <Icon
                    name={Icons.CHECK_CIRCLE}
                    color={getGlobalValue('successIcon')}
                  />
                  <Text>{t('create.location.country.location_school')}</Text>
                  <Button
                    variant={ButtonVariants.LINK}
                    onClick={() => {
                      onFieldChange({
                        country: Countries.BE,
                        municipality: undefined,
                      });
                      setAudienceType(AudienceType.EVERYONE);
                    }}
                  >
                    {t('create.location.country.change_location')}
                  </Button>
                </Inline>
                <Alert maxWidth="53rem">
                  {t('create.location.country.location_school_info')}
                </Alert>
              </>,
            );
          }

          if (!municipality) {
            return (
              <>
                {scope === OfferTypes.EVENTS && OnlineToggle}
                {renderFieldWithRecentLocations(
                  <Inline spacing={1} alignItems="center">
                    <CityPicker
                      name="city-picker-location-step"
                      country={country}
                      offerId={offerId}
                      value={field.value?.municipality}
                      onChange={(value) => {
                        onFieldChange({
                          municipality: value,
                          place: undefined,
                        });
                      }}
                      width="22rem"
                    />
                    <CountryPicker
                      value={country}
                      includeLocationSchool={scope === OfferTypes.EVENTS}
                      onChange={(newCountry) => {
                        onFieldChange({ country: newCountry });
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
                  </Inline>,
                )}
              </>
            );
          }

          return renderFieldWithRecentLocations(
            <>
              <Inline alignItems="center" spacing={3}>
                <Icon
                  name={Icons.CHECK_CIRCLE}
                  color={getGlobalValue('successIcon')}
                />
                <Text>{municipality.name}</Text>
                <Button
                  variant={ButtonVariants.LINK}
                  onClick={() => {
                    onFieldChange({
                      municipality: undefined,
                      streetAndNumber: undefined,
                    });
                    setStreetAndNumber('');
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
                  onFieldChange={onFieldChange}
                />
              )}
              {scope === OfferTypes.PLACES && (
                <Stack>
                  {field.value.streetAndNumber ? (
                    <Inline alignItems="center" spacing={3}>
                      <Icon
                        name={Icons.CHECK_CIRCLE}
                        color={getGlobalValue('successIcon')}
                      />
                      <Text>{field.value.streetAndNumber}</Text>
                      <Button
                        variant={ButtonVariants.LINK}
                        onClick={() => {
                          onFieldChange({
                            streetAndNumber: undefined,
                          });
                          setStreetAndNumber('');
                        }}
                      >
                        {t(`create.location.street_and_number.change`)}
                      </Button>
                    </Inline>
                  ) : (
                    <FormElement
                      Component={
                        <Input
                          value={streetAndNumber}
                          onBlur={(e) => {
                            onFieldChange({
                              streetAndNumber: streetAndNumber,
                            });
                          }}
                          onChange={handleChangeStreetAndNumber}
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
              )}
            </>,
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
