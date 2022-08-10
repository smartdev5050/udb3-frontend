import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { City } from '@/hooks/api/cities';
import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

import { CityPicker } from '../CityPicker';
import { FormDataUnion, StepsConfiguration } from './Steps';

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

  const getValue = getValueFromTheme('createPage');

  return (
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
              <Inline alignItems="center" spacing={3}>
                <Icon
                  name={Icons.CHECK_CIRCLE}
                  color={getValue('check.circleFillColor')}
                />
                <Text>{selectedMunicipality.name}</Text>
                <Button
                  variant={ButtonVariants.LINK}
                  onClick={() =>
                    reset(
                      {
                        ...getValues(),
                        municipalityAndPlace: {
                          ...field.value,
                          municipality: undefined,
                        },
                      },
                      {
                        keepDirty: true,
                      },
                    )
                  }
                >
                  {t('create.municipality_and_place.municipality.change')}
                </Button>
              </Inline>
            )}
          </Stack>
        );
      }}
    />
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
