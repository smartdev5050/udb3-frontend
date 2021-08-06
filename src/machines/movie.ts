import { assign, createMachine } from 'xstate';

import type { MovieThemes } from '@/constants/MovieThemes';
import { OfferCategories } from '@/constants/OfferCategories';
import { OfferType } from '@/constants/OfferType';
import type { Values } from '@/types/Values';

const MovieEventTypes = {
  CHOOSE_THEME: 'CHOOSE_THEME',
  CLEAR_THEME: 'CLEAR_THEME',
  CHANGE_TIME_TABLE: 'CHANGE_TIME_TABLE',
} as const;

type Theme = Values<typeof MovieThemes>;
type Time = string;

type MovieContext = {
  offerType: typeof OfferType.EVENT;
  type: typeof OfferCategories.Film;
  theme: Theme;
  timeTable: Time[][];
};

type MovieEvent =
  | { type: typeof MovieEventTypes.CHOOSE_THEME; value: Theme }
  | { type: typeof MovieEventTypes.CLEAR_THEME }
  | { type: typeof MovieEventTypes.CHANGE_TIME_TABLE; value: Time[][] };

type MovieStateSchema = {
  value: any;
  context: any;
  states: {
    idle: {};
  };
};

const movieMachine = createMachine<MovieContext, MovieEvent, MovieStateSchema>({
  id: 'movie',
  initial: 'idle',
  context: {
    offerType: OfferType.EVENT,
    type: OfferCategories.Film,
    theme: null,
    timeTable: null,
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
          // target: 'themeChosen',
        },
        [MovieEventTypes.CLEAR_THEME]: {
          actions: [
            assign({
              theme: () => null,
            }),
          ],
          target: 'idle',
        },
        [MovieEventTypes.CHANGE_TIME_TABLE]: {
          actions: [
            assign({
              timeTable: (ctx, event) => event.value,
            }),
          ],
        },
      },
    },
  },
});

export type { MovieContext, MovieEvent, MovieStateSchema };
export { MovieEventTypes, movieMachine };
