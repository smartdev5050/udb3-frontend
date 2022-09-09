import { TFunction } from 'i18next';
import debounce from 'lodash/debounce';
import { memo, useEffect, useMemo, useState } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import type { EventTypes } from '@/constants/EventTypes';
import { useChangeLocationMutation } from '@/hooks/api/events';
import { useGetPlacesByQuery } from '@/hooks/api/places';
import type {
  FormDataUnion,
  StepProps,
  StepsConfiguration,
} from '@/pages/steps/Steps';
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
import { isOneTimeSlotValid } from '@/ui/TimeTable';
import { NewEntry, Typeahead } from '@/ui/Typeahead';
import { parseOfferId } from '@/utils/parseOfferId';
import { valueToArray } from '@/utils/valueToArray';

const getValue = getValueFromTheme('createPage');

const useEditLocation = <TFormData extends FormDataUnion>({
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

type PlaceStepProps<TFormData extends FormDataUnion> = StackProps &
  StepProps<TFormData> & {
    terms: Array<Values<typeof EventTypes>>;
    zip?: string;
    chooseLabel: (t: TFunction) => string;
    placeholderLabel: (t: TFunction) => string;
    parentOnChange?: (val: Place | NewEntry | undefined) => void;
    parentFieldOnChange?: (val: Place | NewEntry | undefined) => void;
    parentFieldValue: any;
  };

const PlaceStep = <TFormData extends FormDataUnion>({
  formState: { errors },
  getValues,
  reset,
  control,
  name,
  loading,
  onChange,
  terms,
  zip,
  chooseLabel,
  placeholderLabel,
  parentOnChange,
  parentFieldOnChange,
  parentFieldValue,
  watch,
  ...props
}: PlaceStepProps<TFormData>) => {
  const { t, i18n } = useTranslation();
  const [searchInput, setSearchInput] = useState('');

  const useGetPlacesQuery = useGetPlacesByQuery(
    {
      name: searchInput,
      terms,
      zip,
    },
    { enabled: !!searchInput },
  );

  // @ts-expect-error
  const places = useMemo<Place[]>(() => useGetPlacesQuery.data?.member ?? [], [
    // @ts-expect-error
    useGetPlacesQuery.data?.member,
  ]);

  // @ts-ignore
  const place = watch('place');

  // @ts-ignore
  const selectedPlace = parentFieldValue
    ? parentFieldValue.place ?? undefined
    : place;

  return (
    <Stack {...getStackProps(props)}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          if (!selectedPlace) {
            return (
              <FormElement
                id="place-step"
                label={chooseLabel(t)}
                error={
                  errors?.place
                    ? t(
                        `movies.create.validation_messages.cinema.${errors?.place.type}`,
                      )
                    : undefined
                }
                loading={loading}
                Component={
                  <Typeahead
                    options={places}
                    onInputChange={debounce(setSearchInput, 275)}
                    labelKey={(place) =>
                      place.name[i18n.language] ??
                      place.name[place.mainLanguage]
                    }
                    selected={valueToArray(selectedPlace as Place)}
                    maxWidth="43rem"
                    onChange={(places) => {
                      if (parentFieldOnChange && parentOnChange) {
                        parentFieldOnChange(places[0]);
                        parentOnChange(places[0]);
                        return;
                      }
                      field.onChange(places[0]);
                      onChange(places[0]);
                    }}
                    minLength={3}
                    placeholder={placeholderLabel(t)}
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
                onClick={() => {
                  if (parentFieldOnChange) {
                    parentFieldOnChange(undefined);
                    return;
                  }
                  field.onChange(undefined);
                }}
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

const placeStepConfiguration: StepsConfiguration<FormDataUnion> = {
  Component: PlaceStep,
  validation: yup.object().shape({}).required(),
  name: 'place',
  shouldShowStep: ({ watch }) => isOneTimeSlotValid(watch('timeTable')),
  title: ({ t }) => t(`movies.create.step3.title`),
};

PlaceStep.defaultProps = {
  terms: [],
};

export { PlaceStep, placeStepConfiguration, useEditLocation };
