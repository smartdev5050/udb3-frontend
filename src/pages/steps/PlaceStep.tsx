import debounce from 'lodash/debounce';
import { useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { EventTypes } from '@/constants/EventTypes';
import { useChangeLocationMutation } from '@/hooks/api/events';
import { useGetPlacesByQuery } from '@/hooks/api/places';
import type { FormDataIntersection, StepProps } from '@/pages/Steps';
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
import { parseOfferId } from '@/utils/parseOfferId';

const getValue = getValueFromTheme('createPage');

const useEditLocation = <TFormData extends FormDataIntersection>({
  eventId,
  onSuccess,
}) => {
  const changeLocationMutation = useChangeLocationMutation({
    onSuccess: () => onSuccess('location'),
  });

  return async ({ place }: TFormData) => {
    if (!place) return;

    await changeLocationMutation.mutateAsync({
      id: eventId,
      locationId: parseOfferId(place['@id']),
    });
  };
};

type PlaceStepProps<TFormData extends FormDataIntersection> = StackProps &
  StepProps<TFormData> & { terms: Array<Values<typeof EventTypes>> };

const PlaceStep = <TFormData extends FormDataIntersection>({
  formState: { errors },
  getValues,
  reset,
  control,
  field,
  loading,
  onChange,
  terms,
  ...props
}: PlaceStepProps<TFormData>) => {
  const { t, i18n } = useTranslation();
  const [searchInput, setSearchInput] = useState('');

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
      <Controller<TFormData>
        control={control}
        name={field}
        render={({ field }) => {
          const selectedPlace = field?.value as Place;

          if (!selectedPlace) {
            return (
              <FormElement
                id="place-step"
                label={t('movies.create.actions.choose_cinema')}
                error={
                  errors?.place
                    ? t(
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
                    selected={field.value ? [field.value as Place] : []}
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
                  reset({ ...getValues(), place: undefined } as any, {
                    keepDirty: true,
                  })
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

export { PlaceStep, useEditLocation };
