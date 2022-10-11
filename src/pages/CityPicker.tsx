import debounce from 'lodash/debounce';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { City, useGetCitiesByQuery } from '@/hooks/api/cities';
import { Countries, Country } from '@/types/Country';
import { FormElement } from '@/ui/FormElement';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Typeahead } from '@/ui/Typeahead';
import { valueToArray } from '@/utils/valueToArray';

type Props = Omit<StackProps, 'onChange'> & {
  country?: Country;
  name: string;
  value: City;
  onChange: (city: City) => void;
  error?: string;
};

const CityPicker = forwardRef<HTMLInputElement, Props>(
  ({ country, name, value, onChange, onBlur, error, ...props }, ref) => {
    const { t } = useTranslation();

    const [citySearchInput, setCitySearchInput] = useState('');

    const getCitiesQuery = useGetCitiesByQuery({
      q: citySearchInput,
      country: country,
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
              selected={valueToArray(value)}
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

CityPicker.defaultProps = {
  country: Countries.BE,
};

export { CityPicker };
export type { City };
