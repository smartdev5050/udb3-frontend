import { TFunction } from 'i18next';
import { Controller, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { EventTypes } from '@/constants/EventTypes';
import { useChangeLocationMutation } from '@/hooks/api/events';
import { FormData as EventFormData } from '@/pages/create/EventForm';
import { Countries } from '@/types/Country';
import { Place } from '@/types/Place';
import { Values } from '@/types/Values';
import { parseSpacing } from '@/ui/Box';
import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { LabelPositions } from '@/ui/Label';
import { RadioButtonTypes } from '@/ui/RadioButton';
import { RadioButtonWithLabel } from '@/ui/RadioButtonWithLabel';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { parseOfferId } from '@/utils/parseOfferId';

import { CityPicker } from '../CityPicker';
import { CountryPicker } from './CountryPicker';
import { PlaceStep } from './PlaceStep';
import { FormDataUnion, StepProps, StepsConfiguration } from './Steps';

const getValue = getValueFromTheme('createPage');

const useEditPlace = <TFormData extends FormDataUnion>({
  eventId,
  onSuccess,
}) => {
  const changeLocationMutation = useChangeLocationMutation();

  return async ({ location }: TFormData) => {
    if (!location.municipality) return;
    if (!location.place) return;

    changeLocationMutation.mutate({
      id: eventId,
      locationId: parseOfferId(location.place['@id']),
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

  return (
    <Stack {...getStackProps(props)}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const {
            isOnline,
            onlineUrl,
            municipality,
            country,
          } = field?.value as EventFormData['location'];

          const OnlineToggle = (
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
                />
              }
              id="online-toggle"
              label={t('create.location.is_online.label')}
              labelPosition={LabelPositions.LEFT}
            />
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

          if (!municipality) {
            return (
              <Stack spacing={4}>
                {OnlineToggle}
                <Inline spacing={1} alignItems="flex-end">
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
                    onChange={(newCountry) => {
                      console.log({ newCountry });
                      const updatedValue = {
                        ...field.value,
                        country: newCountry,
                      };
                      field.onChange(updatedValue);
                      onChange(updatedValue);
                    }}
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
                    color={getValue('check.circleFillColor')}
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
                    {t('create.location.municipality.change')}
                  </Button>
                </Inline>
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
                  {...{
                    formState,
                    getValues,
                    reset,
                    control,
                    loading,
                    terms,
                    field,
                    onChange,
                    watch,
                  }}
                  {...props}
                />
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
  validation: yup
    .object()
    .shape({
      onlineUrl: yup.string().url(),
      place: yup.object().shape({}).required(),
      country: yup.string().oneOf(Object.values(Countries)).required(),
    })
    .required(),
};

LocationStep.defaultProps = {};

export { locationStepConfiguration, useEditPlace };
