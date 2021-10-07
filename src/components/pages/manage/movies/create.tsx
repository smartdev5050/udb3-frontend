import { useMachine } from '@xstate/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { State } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { MovieThemes } from '@/constants/MovieThemes';
import { OfferCategories } from '@/constants/OfferCategories';
import { OfferType } from '@/constants/OfferType';
import { useLog } from '@/hooks/useLog';
import type { Place } from '@/types/Place';
import type { Production } from '@/types/Production';
import type { Values } from '@/types/Values';
import { Page } from '@/ui/Page';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Step4 } from './Step4';
import { Step5 } from './Step5';

const MovieEventTypes = {
  CHOOSE_THEME: 'CHOOSE_THEME',
  CLEAR_THEME: 'CLEAR_THEME',
  CHANGE_TIME_TABLE: 'CHANGE_TIME_TABLE',
  CHOOSE_CINEMA: 'CHOOSE_CINEMA',
  CLEAR_CINEMA: 'CLEAR_CINEMA',
  CHOOSE_PRODUCTION: 'CHOOSE_PRODUCTION',
  CLEAR_PRODUCTION: 'CLEAR_PRODUCTION',
} as const;

type Theme = Values<typeof MovieThemes>;
type Time = string;

type MovieContext = {
  offerType: typeof OfferType.EVENT;
  type: typeof OfferCategories.Film;
  theme: Theme;
  timeTable: Time[][];
  cinema: Place;
  production: Production;
};

type MovieEvent =
  | { type: typeof MovieEventTypes.CHOOSE_THEME; value: Theme }
  | { type: typeof MovieEventTypes.CLEAR_THEME }
  | { type: typeof MovieEventTypes.CHANGE_TIME_TABLE; value: Time[][] }
  | { type: typeof MovieEventTypes.CHOOSE_CINEMA; value: Place }
  | { type: typeof MovieEventTypes.CLEAR_CINEMA }
  | { type: typeof MovieEventTypes.CHOOSE_PRODUCTION; value: Production }
  | { type: typeof MovieEventTypes.CLEAR_PRODUCTION };

type MachineProps = {
  movieState: State<MovieContext, MovieEvent>;
  sendMovieEvent: (event: MovieEvent) => State<MovieContext, MovieEvent>;
};

const movieMachine = createMachine<MovieContext, MovieEvent>({
  id: 'movie',
  initial: 'idle',
  context: {
    offerType: OfferType.EVENT,
    type: OfferCategories.Film,
    theme: null,
    timeTable: null,
    cinema: null,
    production: null,
  },
  states: {
    idle: {
      on: {
        [MovieEventTypes.CHOOSE_THEME]: {
          actions: [
            assign({
              theme: (ctx, event) => event.value,
            }),
          ],
        },
        [MovieEventTypes.CLEAR_THEME]: {
          actions: [
            assign({
              theme: () => null,
            }),
          ],
        },
        [MovieEventTypes.CHANGE_TIME_TABLE]: {
          actions: [
            assign({
              timeTable: (ctx, event) => event.value,
            }),
          ],
        },
        [MovieEventTypes.CHOOSE_CINEMA]: {
          actions: [
            assign({
              cinema: (ctx, event) => event.value,
            }),
          ],
        },
        [MovieEventTypes.CLEAR_CINEMA]: {
          actions: [
            assign({
              cinema: () => null,
            }),
          ],
        },
        [MovieEventTypes.CHOOSE_PRODUCTION]: {
          actions: [
            assign({
              production: (ctx, event) => event.value,
            }),
          ],
        },
        [MovieEventTypes.CLEAR_PRODUCTION]: {
          actions: [
            assign({
              production: () => null,
            }),
          ],
        },
      },
    },
  },
});

const Create = () => {
  const [movieState, sendMovieEvent] = useMachine(movieMachine);

  const { t } = useTranslation();

  useLog({ production: movieState.context.production });

  const steps = useMemo(() => [Step1, Step2, Step3, Step4, Step5], []);

  return (
    <Page>
      <Page.Title spacing={3} alignItems="center">
        {t(`movies.create.title`)}
      </Page.Title>
      <Page.Content spacing={5} paddingBottom={6}>
        {steps.map((Step, index) => (
          <Step
            movieState={movieState}
            sendMovieEvent={sendMovieEvent}
            key={index}
          />
        ))}
      </Page.Content>
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export type { MachineProps };
export { MovieEventTypes };
export default Create;
