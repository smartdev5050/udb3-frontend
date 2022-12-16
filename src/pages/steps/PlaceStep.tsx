import { TFunction } from 'i18next';
import debounce from 'lodash/debounce';
import { useMemo, useState } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { EventTypes } from '@/constants/EventTypes';
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
import { isNewEntry, NewEntry, Typeahead } from '@/ui/Typeahead';
import { parseOfferId } from '@/utils/parseOfferId';
import { valueToArray } from '@/utils/valueToArray';

import { City } from '../CityPicker';
import { PlaceAddModal } from '../PlaceAddModal';

const getGlobalValue = getValueFromTheme('global');

type PlaceStepProps = StackProps &
  StepProps & {
    terms: Array<Values<typeof EventTypes>>;
    municipality?: City;
    chooseLabel: (t: TFunction) => string;
    placeholderLabel: (t: TFunction) => string;
    parentOnChange?: (val: Place | NewEntry | undefined) => void;
    parentFieldOnChange?: (val: Place | NewEntry | undefined) => void;
    parentFieldValue: any;
  };

const PlaceStep = ({
  formState: { errors },
  getValues,
  reset,
  control,
  name,
  loading,
  onChange,
  terms,
  municipality,
  chooseLabel,
  placeholderLabel,
  parentOnChange,
  parentFieldOnChange,
  parentFieldValue,
  watch,
  ...props
}: PlaceStepProps) => {
  const { t, i18n } = useTranslation();
  const [searchInput, setSearchInput] = useState('');
  const [prefillPlaceName, setPrefillPlaceName] = useState('');
  const [isPlaceAddModalVisible, setIsPlaceAddModalVisible] = useState(false);

  const isMovie = terms.includes(EventTypes.Bioscoop);

  const useGetPlacesQuery = useGetPlacesByQuery(
    {
      name: searchInput,
      terms,
      zip: municipality?.zip,
    },
    { enabled: !!searchInput },
  );

  const places = useMemo<Place[]>(
    // @ts-expect-error
    () => useGetPlacesQuery.data?.member ?? [],
    [
      // @ts-expect-error
      useGetPlacesQuery.data?.member,
    ],
  );

  const place = useWatch({ control, name: 'location.place' });

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
              <Stack>
                <PlaceAddModal
                  visible={isPlaceAddModalVisible}
                  onClose={() => setIsPlaceAddModalVisible(false)}
                  prefillPlaceName={prefillPlaceName}
                  municipality={municipality}
                  onConfirmSuccess={(place) => {
                    parentFieldOnChange(place);
                    parentOnChange(place);
                  }}
                />
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
                        const place = places[0];

                        if (isNewEntry(place)) {
                          setPrefillPlaceName(place.label);
                          setIsPlaceAddModalVisible(true);
                          return;
                        }

                        if (parentFieldOnChange && parentOnChange) {
                          parentFieldOnChange(place);
                          parentOnChange(place);
                          return;
                        }
                        field.onChange(place);
                        onChange(place);
                      }}
                      minLength={3}
                      placeholder={placeholderLabel(t)}
                      newSelectionPrefix="Locatie niet gevonden? "
                      allowNew={!isMovie}
                    />
                  }
                />
              </Stack>
            );
          }

          return (
            <Inline alignItems="center" spacing={3}>
              <Icon
                name={Icons.CHECK_CIRCLE}
                color={getGlobalValue('successIcon')}
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
                {isMovie
                  ? t('movies.create.actions.change_cinema')
                  : t('create.location.country.change_location')}
              </Button>
            </Inline>
          );
        }}
      />
    </Stack>
  );
};

const placeStepConfiguration: StepsConfiguration = {
  Component: PlaceStep,
  validation: yup.object().shape({}).required(),
  name: 'place',
  shouldShowStep: ({ watch }) => isOneTimeSlotValid(watch('timeTable')),
  title: ({ t }) => t(`movies.create.step3.title`),
};

PlaceStep.defaultProps = {
  terms: [],
};

export { PlaceStep, placeStepConfiguration };
