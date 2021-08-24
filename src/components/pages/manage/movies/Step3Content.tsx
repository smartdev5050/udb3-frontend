import { throttle } from 'lodash';
import { MovieEventTypes } from 'machines/movie';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { OfferCategories } from '@/constants/OfferCategories';
import { useGetPlacesByQuery } from '@/hooks/api/places';
import type { Place } from '@/types/Place';
import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import type { StackProps } from '@/ui/Stack';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { TypeaheadWithLabel } from '@/ui/TypeaheadWithLabel';

import type { MachineProps } from './create';

const getValue = getValueFromTheme('moviesCreatePage');

type Step3ContentProps = StackProps & MachineProps;

const Step3Content = ({
  movieState,
  sendMovieEvent,
  ...props
}: Step3ContentProps) => {
  const { t, i18n } = useTranslation();
  const [searchInput, setSearchInput] = useState('');

  const useGetCinemasQuery = useGetPlacesByQuery(
    {
      name: searchInput,
      terms: [OfferCategories.Bioscoop],
    },
    { enabled: !!searchInput },
  );

  // @ts-expect-error
  const cinemas = useMemo(() => useGetCinemasQuery.data?.member ?? [], [
    // @ts-expect-error
    useGetCinemasQuery.data?.member,
  ]);

  return (
    <Stack {...getStackProps(props)}>
      {movieState.context.cinema === null ? (
        <TypeaheadWithLabel<Place>
          id="step3-cinema-typeahead"
          label={t('movies.create.actions.choose_cinema')}
          options={cinemas}
          onInputChange={throttle(setSearchInput, 275)}
          labelKey={(cinema) =>
            cinema.name[i18n.language] ?? cinema.name[cinema.mainLanguage]
          }
          maxWidth="43rem"
          onChange={(value) => {
            sendMovieEvent({ type: 'CHOOSE_CINEMA', value: value[0] });
          }}
          minLength={3}
        />
      ) : (
        <Inline alignItems="center" spacing={3}>
          <Icon
            name={Icons.CHECK_CIRCLE}
            color={getValue('check.circleFillColor')}
          />
          <Text>
            {movieState.context.cinema.name[i18n.language] ??
              movieState.context.cinema.name[
                movieState.context.cinema.mainLanguage
              ]}
          </Text>
          <Button
            variant={ButtonVariants.LINK}
            onClick={() =>
              sendMovieEvent({ type: MovieEventTypes.CLEAR_CINEMA })
            }
          >
            {t('movies.create.actions.change_cinema')}
          </Button>
        </Inline>
      )}
    </Stack>
  );
};

export { Step3Content };
