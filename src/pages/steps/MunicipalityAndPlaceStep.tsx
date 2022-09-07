import { TFunction } from 'i18next';
import { Controller, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { EventTypes } from '@/constants/EventTypes';
import { City } from '@/hooks/api/cities';
import { useChangeLocationMutation } from '@/hooks/api/events';
import { FormData as EventFormData } from '@/pages/create/EventForm';
import { Place } from '@/types/Place';
import { Values } from '@/types/Values';
import { Alert } from '@/ui/Alert';
import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { RadioButtonTypes } from '@/ui/RadioButton';
import { RadioButtonWithLabel } from '@/ui/RadioButtonWithLabel';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { parseOfferId } from '@/utils/parseOfferId';

import { CityPicker } from '../CityPicker';
import { PlaceStep } from './PlaceStep';
import { FormDataUnion, StepProps, StepsConfiguration } from './Steps';

const getValue = getValueFromTheme('createPage');

const useEditMunicipalityAndPlace = <TFormData extends FormDataUnion>({
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

type MunicipalityAndPlaceStepProps<
  TFormData extends FormDataUnion
> = StackProps &
  StepProps<TFormData> & {
    terms: Array<Values<typeof EventTypes>>;
    chooseLabel: (t: TFunction) => string;
    placeholderLabel: (t: TFunction) => string;
  };

const MunicipalityAndPlaceStep = <TFormData extends FormDataUnion>({
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
}: MunicipalityAndPlaceStepProps<TFormData>) => {
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
          } = field?.value as EventFormData['location'];

          const OnlineToggle = (
            <RadioButtonWithLabel
              id="online-toggle"
              type={RadioButtonTypes.SWITCH}
              label={'Online'}
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
          );

          if (isOnline) {
            return (
              <Stack>
                {OnlineToggle}
                <FormElement
                  Component={
                    <Input
                      maxWidth="28rem"
                      value={onlineUrl}
                      onChange={(e) => {
                        field.onChange({
                          ...field?.value,
                          onlineUrl: e.target.value,
                        });
                      }}
                    />
                  }
                  id="online-url"
                  label={'Url voor online deelname'}
                  error={
                    formState.errors.location &&
                    t('organizer.add_modal.validation_messages.name')
                  }
                  info={
                    <Alert maxWidth="53rem">
                      Voeg een link toe zodat mensen weten hoe ze aan je
                      evenement kunnen deelnemen. Wil je de deelnamelink niet
                      publiek delen? Dan kan je deze stap overslaan en
                      deelname-instructies toevoegen aan je beschrijving in stap
                      5.
                    </Alert>
                  }
                />
              </Stack>
            );
          }

          if (!municipality) {
            return (
              <Stack>
                {OnlineToggle}
                <CityPicker
                  maxWidth="28rem"
                  {...field}
                  value={field.value?.municipality}
                  onChange={(value) =>
                    field.onChange({
                      ...field.value,
                      municipality: value,
                      place: undefined,
                    })
                  }
                />
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
                    onClick={() =>
                      field.onChange({
                        ...field.value,
                        municipality: undefined,
                      })
                    }
                  >
                    {t('create.municipality_and_place.municipality.change')}
                  </Button>
                </Inline>
                <PlaceStep
                  name={'location.place' as Path<TFormData>}
                  zip={municipality.zip}
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

const municipalityAndPlaceStepConfiguration: StepsConfiguration<FormDataUnion> = {
  Component: MunicipalityAndPlaceStep,
  name: 'location',
  shouldShowStep: ({ watch }) => !!watch('typeAndTheme')?.type?.id,
  title: (t) => t('create.municipality_and_place.title'),
  stepProps: {
    chooseLabel: (t) => t('create.municipality_and_place.place.choose_label'),
    placeholderLabel: (t) =>
      t('create.municipality_and_place.place.placeholder'),
  },
  defaultValue: {
    isOnline: false,
  },
};

MunicipalityAndPlaceStep.defaultProps = {};

export { municipalityAndPlaceStepConfiguration, useEditMunicipalityAndPlace };
