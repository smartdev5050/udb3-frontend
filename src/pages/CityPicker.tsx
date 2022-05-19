import debounce from 'lodash/debounce';
import { forwardRef, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetMunicipalitiesByQuery } from '@/hooks/api/municipalities';
import { FormElement } from '@/ui/FormElement';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Typeahead } from '@/ui/Typeahead';

type Municipality = {
  name: string;
  key: string;
};

type Props = Omit<StackProps, 'onChange'> & {
  name: string;
  value: string;
  onChange: (cityName: string) => void;
  error?: string;
};

const CityPicker = forwardRef<HTMLInputElement, Props>(
  ({ name, value, onChange, onBlur, error, ...props }, ref) => {
    const { t } = useTranslation();

    const [citySearchInput, setCitySearchInput] = useState('');

    const getMunicipalitiesQuery = useGetMunicipalitiesByQuery({
      q: citySearchInput,
    });

    const municipalities = getMunicipalitiesQuery.data ?? [];

    return (
      <Stack {...getStackProps(props)}>
        <FormElement
          id="city_picker"
          label={t('city_picker.label')}
          error={error}
          Component={
            <Typeahead<Municipality>
              name={name}
              ref={ref}
              options={municipalities}
              labelKey={(municipality) => municipality.name}
              selected={
                value
                  ? [
                      municipalities.find(
                        (municipality) => municipality.name === value,
                      ),
                    ]
                  : []
              }
              onInputChange={debounce(setCitySearchInput, 275)}
              onChange={([value]: [Municipality]) =>
                onChange(value?.name ?? '')
              }
              onBlur={onBlur}
              minLength={3}
              emptyLabel={t('city_picker.no_municipalities')}
            />
          }
        />
      </Stack>
    );
  },
);

export { CityPicker };
