import { assign, createMachine } from 'xstate';

import type { MovieThemes } from '@/constants/MovieThemes';
import { OfferCategories } from '@/constants/OfferCategories';
import { OfferType } from '@/constants/OfferType';
import type { Values } from '@/types/Values';

const MovieEventTypes = {
  CHOOSE_THEME: 'CHOOSE_THEME',
  CLEAR_THEME: 'CLEAR_THEME',
} as const;

type Theme = Values<typeof MovieThemes>;

type MovieContext = {
  offerType: typeof OfferType.EVENT;
  type: typeof OfferCategories.Film;
  theme: Theme;
};

type MovieEvent =
  | { type: typeof MovieEventTypes.CHOOSE_THEME; value: Theme }
  | { type: typeof MovieEventTypes.CLEAR_THEME };

type MovieStateSchema = {
  value: any;
  context: any;
  states: {
    idle: {};
    themeChosen: {};
  };
};

const movieMachine = createMachine<MovieContext, MovieEvent, MovieStateSchema>({
  id: 'movie',
  initial: 'idle',
  context: {
    offerType: OfferType.EVENT,
    type: OfferCategories.Film,
    theme: null,
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
          target: 'themeChosen',
        },
      },
    },
    themeChosen: {
      on: {
        [MovieEventTypes.CLEAR_THEME]: {
          actions: [
            assign({
              theme: () => null,
            }),
          ],
          target: 'idle',
        },
      },
    },
  },
});

export { MovieEventTypes, movieMachine };
