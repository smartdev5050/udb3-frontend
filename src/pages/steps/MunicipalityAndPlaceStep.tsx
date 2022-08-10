import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { City } from '@/hooks/api/cities';
import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

import { CityPicker } from '../CityPicker';
import { FormDataUnion, StepsConfiguration } from './Steps';

const getValue = getValueFromTheme('createPage');

const useEditMunicipalityAndPlace = <TFormData extends FormDataUnion>({
  eventId,
  onSuccess,
}) => {};

const MunicipalityAndPlaceStep = <TFormData extends FormDataUnion>({
  formState: { errors },
  getValues,
  reset,
  control,
  field,
  loading,
  onChange,
  terms,
  ...props
}) => {
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
