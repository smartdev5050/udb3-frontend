import debounce from 'lodash/debounce';
import { FormEvent, forwardRef, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetCitiesByQuery } from '@/hooks/api/cities';
import { FormElement } from '@/ui/FormElement';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Typeahead } from '@/ui/Typeahead';

type City = {
  name: string;
  key: string;
};

type Props = Omit<StackProps, 'onChange'> & {
  name: string;
  value: string;
  onChange: (cityName: string) => void;
};

const CityPicker = forwardRef<HTMLInputElement, Props>(
  ({ name, value, onChange, onBlur, ...props }, ref) => {
    const { t } = useTranslation();

    const [citySearchInput, setCitySearchInput] = useState('');

    const getCitiesQuery = useGetCitiesByQuery({
      q: citySearchInput,
    });

    const cities = useMemo(() => {
      return getCitiesQuery.data;
    }, [getCitiesQuery.data]);

    return (
      <Stack {...getStackProps(props)}>
        <FormElement
          id="create-city"
          label={t('create.additionalInformation.city.title')}
          Component={
            <Typeahead<City>
              name={name}
              ref={ref}
              options={cities}
              labelKey={(city) => city.name}
              selected={
                value ? [cities.find((city) => city.name === value)] : []
              }
              onInputChange={debounce(setCitySearchInput, 275)}
              onChange={([value]: [City]) => onChange(value?.name ?? '')}
              onBlur={onBlur}
              minLength={3}
              newSelectionPrefix={t(
                'create.additionalInformation.city.add_new',
              )}
            />
          }
        />
      </Stack>
    );
  },
);

export { CityPicker };
