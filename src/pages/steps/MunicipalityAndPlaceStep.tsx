import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { EventTypes } from '@/constants/EventTypes';
import { City } from '@/hooks/api/cities';
import { Values } from '@/types/Values';
import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

import { CityPicker } from '../CityPicker';
import { PlaceStep } from './PlaceStep';
import { FormDataUnion, StepProps, StepsConfiguration } from './Steps';

const getValue = getValueFromTheme('createPage');

const useEditMunicipalityAndPlace = <TFormData extends FormDataUnion>({
  eventId,
  onSuccess,
}) => {};

type MunicipalityAndPlaceStepProps<
  TFormData extends FormDataUnion
> = StackProps &
  StepProps<TFormData> & { terms: Array<Values<typeof EventTypes>> };

const MunicipalityAndPlaceStep = <TFormData extends FormDataUnion>({
  formState,
  getValues,
  reset,
  control,
  field,
  loading,
  onChange,
  terms,
  ...props
}: MunicipalityAndPlaceStepProps<TFormData>) => {
  const { t, i18n } = useTranslation();

  return (
    <Stack {...getStackProps(props)}>
      <Controller<TFormData>
        control={control}
        name={field}
        render={({ field }) => {
          const selectedMunicipality = field?.value?.municipality as City;
          return (
            <Stack>
              {!selectedMunicipality && (
                <CityPicker
                  {...field}
                  value={field.value?.municipality}
                  onChange={(value) =>
                    field.onChange({ ...field.value, municipality: value })
                  }
                />
              )}
              {selectedMunicipality && (
                <Stack>
                  <Inline alignItems="center" spacing={3}>
                    <Icon
                      name={Icons.CHECK_CIRCLE}
                      color={getValue('check.circleFillColor')}
                    />
                    <Text>{selectedMunicipality.name}</Text>
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
                    field="municipalityAndPlace.place"
                    onChange={() => {}}
                    {...{
                      formState,
                      getValues,
                      reset,
                      control,
                      loading,
                      terms,
                    }}
                    zip={selectedMunicipality.zip}
                  />
                </Stack>
              )}
            </Stack>
          );
        }}
      />
    </Stack>
  );
};

const municipalityAndPlaceStepConfiguration: StepsConfiguration<FormDataUnion> = {
  Component: MunicipalityAndPlaceStep,
  field: 'municipalityAndPlace',
  shouldShowStep: () => true,
  title: (t) => t('create.municipality_and_place.title'),
};

MunicipalityAndPlaceStep.defaultProps = {};

export { municipalityAndPlaceStepConfiguration };
