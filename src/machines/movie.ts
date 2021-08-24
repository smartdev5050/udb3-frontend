import { assign, createMachine } from 'xstate';

import type { MovieThemes } from '@/constants/MovieThemes';
import { OfferCategories } from '@/constants/OfferCategories';
import { OfferType } from '@/constants/OfferType';
import type { Place } from '@/types/Place';
import type { Values } from '@/types/Values';

const MovieEventTypes = {
  CHOOSE_THEME: 'CHOOSE_THEME',
  CLEAR_THEME: 'CLEAR_THEME',
  CHANGE_TIME_TABLE: 'CHANGE_TIME_TABLE',
  CHOOSE_CINEMA: 'CHOOSE_CINEMA',
  CLEAR_CINEMA: 'CLEAR_CINEMA',
} as const;

type Theme = Values<typeof MovieThemes>;
type Time = string;

type MovieContext = {
  offerType: typeof OfferType.EVENT;
  type: typeof OfferCategories.Film;
  theme: Theme;
  timeTable: Time[][];
  cinema: Place;
};

type MovieEvent =
  | { type: typeof MovieEventTypes.CHOOSE_THEME; value: Theme }
  | { type: typeof MovieEventTypes.CLEAR_THEME }
  | { type: typeof MovieEventTypes.CHANGE_TIME_TABLE; value: Time[][] }
  | { type: typeof MovieEventTypes.CHOOSE_CINEMA; value: Place }
  | { type: typeof MovieEventTypes.CLEAR_CINEMA };

const movieMachine = createMachine<MovieContext, MovieEvent>({
  id: 'movie',
  initial: 'idle',
  context: {
    offerType: OfferType.EVENT,
    type: OfferCategories.Film,
    theme: null,
    timeTable: null,
    cinema: null,
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
      },
    },
  },
});

export type { MovieContext, MovieEvent };
export { MovieEventTypes, movieMachine };
