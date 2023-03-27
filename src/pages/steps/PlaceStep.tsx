import { TFunction } from 'i18next';
import debounce from 'lodash/debounce';
import { useMemo, useState } from 'react';
import { Highlighter } from 'react-bootstrap-typeahead';
import { Controller, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { EventTypes } from '@/constants/EventTypes';
import { useGetPlacesByQuery } from '@/hooks/api/places';
import { SupportedLanguage } from '@/i18n/index';
import type { StepProps, StepsConfiguration } from '@/pages/steps/Steps';
import { Address, AddressInternal } from '@/types/Address';
import { Country } from '@/types/Country';
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
import { isNewEntry, Typeahead } from '@/ui/Typeahead';
import { getLanguageObjectOrFallback } from '@/utils/getLanguageObjectOrFallback';
import { valueToArray } from '@/utils/valueToArray';

import { City } from '../CityPicker';
import { PlaceAddModal } from '../PlaceAddModal';

const getGlobalValue = getValueFromTheme('global');

type PlaceStepProps = StackProps &
  StepProps & {
    terms: Array<Values<typeof EventTypes>>;
    municipality?: City;
    country?: Country;
    chooseLabel: (t: TFunction) => string;
    placeholderLabel: (t: TFunction) => string;
    onFieldChange: StepProps['onChange'];
  };

const PlaceStep = ({
  formState: { errors },
  getValues,
  reset,
  control,
  name,
  loading,
  onFieldChange,
  terms,
  municipality,
  country,
  chooseLabel,
  placeholderLabel,
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
      addressLocality: municipality?.name,
      addressCountry: country,
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

  const getPlaceName = (
    name: Place['name'],
    mainLanguage: SupportedLanguage,
  ): AddressInternal['streetAddress'] => {
    return getLanguageObjectOrFallback(
      name,
      i18n.language as SupportedLanguage,
      mainLanguage,
    );
  };

  const getAddress = (
    address: Address,
    mainLanguage: SupportedLanguage,
  ): AddressInternal => {
    return getLanguageObjectOrFallback(
      address,
      i18n.language as SupportedLanguage,
      mainLanguage,
    );
  };

  const filterByCallback = (place: Place, props) => {
    const name = getPlaceName(place.name, place.mainLanguage);
    const address = getAddress(place.address, place.mainLanguage);

    return (
      address.streetAddress.toLowerCase().includes(props.text.toLowerCase()) ||
      name.toLowerCase().includes(props.text.toLowerCase())
    );
  };

  return (
    <Stack {...getStackProps(props)}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const selectedPlace = place?.['@id'] ? place : null;

          if (!selectedPlace) {
            return (
              <Stack>
                <PlaceAddModal
                  visible={isPlaceAddModalVisible}
                  onClose={() => setIsPlaceAddModalVisible(false)}
                  prefillPlaceName={prefillPlaceName}
                  municipality={municipality}
                  country={country}
                  onConfirmSuccess={(place) => {
                    onFieldChange({ place });
                    setIsPlaceAddModalVisible(false);
                  }}
                />
                <FormElement
                  id="place-step"
                  label={chooseLabel(t)}
                  error={
                    errors?.location?.place
                      ? t(
                          `movies.create.validation_messages.cinema.${errors.location.place.type}`,
                        )
                      : undefined
                  }
                  Component={
                    <Typeahead
                      options={places}
                      onInputChange={debounce(setSearchInput, 275)}
                      customFilter={filterByCallback}
                      labelKey={(place) =>
                        getPlaceName(place.name, place.mainLanguage)
                      }
                      renderMenuItemChildren={(place: Place, { text }) => {
                        const { mainLanguage, name, address } = place;
                        const placeName = getPlaceName(name, mainLanguage);
                        const { streetAddress } = getAddress(
                          address,
                          mainLanguage,
                        );
                        return (
                          <Stack
                            css={`
                              .address {
                                color: ${({ theme }) => theme.colors.grey6};
                              }

                              &:hover .address {
                                color: white;
                              }
                            `}
                          >
                            <Text>
                              <Highlighter search={text}>
                                {placeName}
                              </Highlighter>
                            </Text>
                            <Text className={'address'}>
                              <Highlighter search={text}>
                                {streetAddress}
                              </Highlighter>
                            </Text>
                          </Stack>
                        );
                      }}
                      selected={valueToArray(selectedPlace as Place)}
                      maxWidth="28rem"
                      onChange={(places) => {
                        const place = places[0];

                        if (isNewEntry(place)) {
                          setPrefillPlaceName(place.label);
                          setIsPlaceAddModalVisible(true);
                          return;
                        }

                        onFieldChange({ place });
                      }}
                      minLength={3}
                      placeholder={placeholderLabel(t)}
                      newSelectionPrefix={t(
                        'create.additionalInformation.place.add_new_label',
                      )}
                      hideNewInputText
                      allowNew={() => !isMovie}
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
                {getLanguageObjectOrFallback(
                  selectedPlace.name,
                  i18n.language as SupportedLanguage,
                  selectedPlace.mainLanguage ?? 'nl',
                )}
              </Text>
              <Button
                variant={ButtonVariants.LINK}
                onClick={() => {
                  field.onChange({ ...field.value, place: undefined });
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

const placeStepConfiguration: StepsConfiguration<'location'> = {
  Component: PlaceStep,
  validation: yup.object().shape({}).required(),
  name: 'location',
  shouldShowStep: ({ watch }) => isOneTimeSlotValid(watch('timeTable')),
  title: ({ t }) => t(`movies.create.step3.title`),
};

PlaceStep.defaultProps = {
  terms: [],
};

export { PlaceStep, placeStepConfiguration };
