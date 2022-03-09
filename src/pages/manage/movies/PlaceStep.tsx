import debounce from 'lodash/debounce';
import { useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { OfferCategories } from '@/constants/OfferCategories';
import { useGetPlacesByQuery } from '@/hooks/api/places';
import type { StepProps } from '@/pages/Steps';
import type { Place } from '@/types/Place';
import type { Values } from '@/types/Values';
import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import type { StackProps } from '@/ui/Stack';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { Typeahead } from '@/ui/Typeahead';

import type { FormData } from './MovieForm';

const getValue = getValueFromTheme('moviesCreatePage');

type PlaceStepProps = StackProps &
  StepProps<FormData> & { terms: Array<Values<typeof OfferCategories>> };

const PlaceStep = ({
  formState: { errors },
  getValues,
  reset,
  control,
  field,
  loading,
  onChange,
  terms,
  ...props
}: PlaceStepProps) => {
  const { t, i18n } = useTranslation();
  const [searchInput, setSearchInput] = useState('');

  console.log(terms);

  const useGetPlacesQuery = useGetPlacesByQuery(
    {
      name: searchInput,
      terms,
    },
    { enabled: !!searchInput },
  );

  // @ts-expect-error
  const places = useMemo(() => useGetPlacesQuery.data?.member ?? [], [
    // @ts-expect-error
    useGetPlacesQuery.data?.member,
  ]);

  return (
    <Stack {...getStackProps(props)}>
      <Controller
        control={control}
        name={field}
        render={({ field }) => {
          const selectedPlace = field?.value;

          if (!selectedPlace) {
            return (
              <FormElement
                id="place-step"
                label={t('movies.create.actions.choose_cinema')}
                error={
                  errors?.place
                    ? t(
                        // @ts-expect-error
                        `movies.create.validation_messages.cinema.${errors?.place.type}`,
                      )
                    : undefined
                }
                loading={loading}
                Component={
                  <Typeahead<Place>
                    options={places}
                    onInputChange={debounce(setSearchInput, 275)}
                    labelKey={(place) =>
                      place.name[i18n.language] ??
                      place.name[place.mainLanguage]
                    }
                    selected={field.value ? [field.value] : []}
                    maxWidth="43rem"
                    onChange={(places) => {
                      field.onChange(places?.[0]);
                      onChange(places?.[0]);
                    }}
                    minLength={3}
                  />
                }
              />
            );
          }
          return (
            <Inline alignItems="center" spacing={3}>
              <Icon
                name={Icons.CHECK_CIRCLE}
                color={getValue('check.circleFillColor')}
              />
              <Text>
                {selectedPlace.name[i18n.language] ??
                  selectedPlace.name[selectedPlace.mainLanguage]}
              </Text>
              <Button
                variant={ButtonVariants.LINK}
                onClick={() =>
                  reset(
                    { ...getValues(), place: undefined },
                    { keepDirty: true },
                  )
                }
              >
                {t('movies.create.actions.change_cinema')}
              </Button>
            </Inline>
          );
        }}
      />
    </Stack>
  );
};

PlaceStep.defaultProps = {
  terms: [],
};

export { PlaceStep };
