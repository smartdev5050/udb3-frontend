import { TFunction } from 'i18next';
import { Controller, Path, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { EventTypes } from '@/constants/EventTypes';
import { OfferType } from '@/constants/OfferType';
import { useChangeLocationMutation } from '@/hooks/api/events';
import { useChangeAddressMutation } from '@/hooks/api/places';
import { FormData as OfferFormData } from '@/pages/create/OfferForm';
import { Address } from '@/types/Address';
import { Countries } from '@/types/Country';
import { Place } from '@/types/Place';
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

import { CityPicker } from '../CityPicker';
import { Features, NewFeatureTooltip } from '../NewFeatureTooltip';
import { CountryPicker } from './CountryPicker';
import { PlaceStep } from './PlaceStep';
import {
  FormDataUnion,
  getStepProps,
  StepProps,
  StepsConfiguration,
} from './Steps';

const getValue = getValueFromTheme('createPage');
const getGlobalValue = getValueFromTheme('global');

const useEditLocation = <TFormData extends FormDataUnion>({
  scope,
  offerId,
  onSuccess,
}) => {
  const { i18n } = useTranslation();
  const changeLocationMutation = useChangeLocationMutation();
  const changeAddressMutation = useChangeAddressMutation();

  return async ({ location }: TFormData) => {
    if (scope === OfferType.EVENTS) {
      if (!location.municipality) return;
      if (!location.place) return;

      // TODO: Add isOnline support

      changeLocationMutation.mutate({
        id: offerId,
        locationId: parseOfferId(location.place['@id']),
      });

      return;
    }

    if (!location.municipality) return;
    if (!location.streetAndNumber) return;

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
  };
};

type PlaceStepProps<TFormData extends FormDataUnion> = StackProps &
  StepProps<TFormData> & {
    terms: Array<Values<typeof EventTypes>>;
    chooseLabel: (t: TFunction) => string;
    placeholderLabel: (t: TFunction) => string;
  };

const LocationStep = <TFormData extends FormDataUnion>({
  formState,
  getValues,
  reset,
  control,
  name,
  loading,
  onChange,
  terms,
  chooseLabel,
  placeholderLabel,
  watch,
  ...props
}: PlaceStepProps<TFormData>) => {
  const { t } = useTranslation();

  const watchedValues = useWatch({ control });
  const scope = watchedValues.scope;

  return (
    <Stack {...getStackProps(props)}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const { isOnline, onlineUrl, municipality, country } =
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
                        isOnline: e.target.checked,
                      };
                      field.onChange(updatedValue);
                      onChange(updatedValue);
                    }}
                    css={`
                      .custom-switch .custom-control-label {
                        padding-left: 2rem;
                        padding-bottom: 1.5rem;
                      }

                      .custom-switch .custom-control-label::before {
                        height: 1.5rem;
                        width: calc(2rem + 0.75rem);
                        border-radius: 3rem;
                      }

                      .custom-switch .custom-control-label::after {
                        width: calc(1.5rem - 4px);
                        height: calc(1.5rem - 4px);
                        border-radius: calc(2rem - (1.5rem / 2));
                      }

                      .custom-switch
                        .custom-control-input:checked
                        ~ .custom-control-label::after {
                        transform: translateX(calc(1.5rem - 0.25rem));
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
                      onChange={(e) => {
                        {
                          const updatedValue = {
                            ...field?.value,
                            onlineUrl: e.target.value,
                          };
                          field.onChange(updatedValue);
                          onChange(updatedValue);
                        }
                      }}
                      onBlur={field.onBlur}
                      placeholder={t('create.location.online_url.placeholder')}
                    />
                  }
                  id="online-url"
                  label={t('create.location.online_url.label')}
                  error={
                    // @ts-expect-error
                    formState.errors.location?.onlineUrl &&
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

          if (!country) {
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
                      };
                      field.onChange(updatedValue);
                      onChange(updatedValue);
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
                {scope === OfferType.EVENTS && OnlineToggle}
                <Inline spacing={1} alignItems="center">
                  <CityPicker
                    name="city-picker-location-step"
                    country={country}
                    value={field.value?.municipality}
                    onChange={(value) => {
                      const updatedValue = {
                        ...field.value,
                        municipality: value,
                        place: undefined,
                      };
                      field.onChange(updatedValue);
                      onChange(updatedValue);
                    }}
                    width="22rem"
                  />
                  <CountryPicker
                    value={country}
                    includeLocationSchool={scope === OfferType.EVENTS}
                    onChange={(newCountry) => {
                      const updatedValue = {
                        ...field.value,
                        country: newCountry,
                      };
                      field.onChange(updatedValue);
                      onChange(updatedValue);
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
                    }}
                  >
                    {t(
                      `create.location.municipality.change_${country?.toLowerCase()}`,
                    )}
                  </Button>
                </Inline>
                {scope === OfferType.EVENTS && (
                  <PlaceStep
                    maxWidth="28rem"
                    name={'location.place' as Path<TFormData>}
                    municipality={municipality}
                    chooseLabel={chooseLabel}
                    placeholderLabel={placeholderLabel}
                    parentFieldValue={field.value}
                    parentFieldOnChange={(val: Place | undefined) => {
                      field.onChange({ ...field.value, place: val });
                    }}
                    parentOnChange={(val: Place | undefined) => {
                      onChange({
                        ...field.value,
                        place: val,
                      });
                    }}
                    {...getStepProps(props)}
                    {...{
                      formState,
                      getValues,
                      reset,
                      control,
                      name,
                      loading,
                      onChange,
                      watch,
                    }}
                  />
                )}
                {scope === OfferType.PLACES && (
                  <FormElement
                    Component={
                      <Input
                        value={field.value?.streetAndNumber}
                        onChange={(e) => {
                          const updatedValue = {
                            ...field.value,
                            streetAndNumber: e.target.value,
                          };
                          field.onChange(updatedValue);
                          onChange(updatedValue);
                        }}
                      />
                    }
                    id="location-streetAndNumber"
                    label={t('location.add_modal.labels.streetAndNumber')}
                    error={
                      // @ts-expect-error
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

const locationStepConfiguration: StepsConfiguration<FormDataUnion> = {
  Component: LocationStep,
  name: 'location',
  shouldShowStep: ({ watch }) => !!watch('typeAndTheme')?.type?.id,
  title: ({ t }) => t('create.location.title'),
  stepProps: {
    chooseLabel: (t) => t('create.location.place.choose_label'),
    placeholderLabel: (t) => t('create.location.place.placeholder'),
  },
  defaultValue: {
    isOnline: false,
    country: Countries.BE,
  },
  validation: yup.lazy((value) => {
    if (value.place) {
      // a location for an event
      return yup
        .object()
        .shape({
          place: yup.object().shape({}).required(),
          country: yup.string().oneOf(Object.values(Countries)),
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
