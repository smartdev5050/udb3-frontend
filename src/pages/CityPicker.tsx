import debounce from 'lodash/debounce';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { City, useGetCitiesByQuery } from '@/hooks/api/cities';
import { FormElement } from '@/ui/FormElement';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Typeahead } from '@/ui/Typeahead';

type Props = Omit<StackProps, 'onChange'> & {
  name: string;
  value: City;
  onChange: (city: City) => void;
  error?: string;
};

const CityPicker = forwardRef<HTMLInputElement, Props>(
  ({ name, value, onChange, onBlur, error, ...props }, ref) => {
    const { t } = useTranslation();

    const [citySearchInput, setCitySearchInput] = useState('');

    const getCitiesQuery = useGetCitiesByQuery({
      q: citySearchInput,
      country: 'BE',
    });

    const cities = getCitiesQuery.data ?? [];

    return (
      <Stack {...getStackProps(props)}>
        <FormElement
          id="city_picker"
          label={t('city_picker.label')}
          error={error}
          Component={
            <Typeahead<City>
              name={name}
              ref={ref}
              options={cities}
              labelKey={(city) => city.label}
              selected={value ? [value] : []}
              onInputChange={debounce(setCitySearchInput, 275)}
              onChange={([value]: [City]) => onChange(value)}
              onBlur={onBlur}
              minLength={3}
              emptyLabel={t('city_picker.no_cities')}
            />
          }
        />
      </Stack>
    );
  },
);

export { CityPicker };
export type { City };
