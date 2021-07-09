import { assign, createMachine } from 'xstate';

import { OfferType } from '@/constants/OfferType';
import type { Values } from '@/types/Values';

const Themes = {
  'Actie- en avonturenfilm': '1.7.2.0.0',
  'Animatie en kinderfilms': '1.7.12.0.0',
  'Documentaires en reportages': '1.7.1.0.0',
  'Griezelfilm of horror': '1.7.6.0.0',
  'Historische film': '1.7.8.0.0',
  Komedie: '1.7.3.0.0',
  Kortfilm: '1.7.13.0.0',
  Filmmusical: '1.7.10.0.0',
  Drama: '1.7.4.0.0',
  'Science fiction': '1.7.7.0.0',
  Cinefiel: '1.7.11.0.0',
  'Meerdere filmgenres': '1.7.14.0.0',
  Thriller: '1.7.15.0.0',
} as const;

const Types = {
  Tentoonstelling: '0.0.0.0.0',
  Opendeurdag: '0.12.0.0.0',
  Monument: '0.14.0.0.0',
  'Natuurgebied of park': '0.15.0.0.0',
  'Park of tuin': '0.16.0.0.0',
  'Fiets- of wandelroute': '0.17.0.0.0',
  'Sportwedstrijd bekijken': '0.19.0.0.0',
  Festiviteit: '0.28.0.0.0',
  Lessenreeks: '0.3.1.0.0',
  'Cursus met open sessies': '0.3.1.0.1',
  'Lezing of congres': '0.3.2.0.0',
  'Congres of studiedag': '0.3.3.0.0',
  'Markt, braderie of kermis': '0.37.0.0.0',
  'Thema of pretpark': '0.41.0.0.0',
  'Party of fuif': '0.49.0.0.0',
  Festival: '0.5.0.0.0',
  'Spel of quiz': '0.50.21.0.0',
  Concert: '0.50.4.0.0',
  Film: '0.50.6.0.0',
  'Recreatiedomein of centrum': '0.53.0.0.0',
  Dansvoorstelling: '0.54.0.0.0',
  Theatervoorstelling: '0.55.0.0.0',
  'Kamp of vakantie': '0.57.0.0.0',
  Sportactiviteit: '0.59.0.0.0',
  Beurs: '0.6.0.0.0',
  'Begeleide uitstap of rondleiding': '0.7.0.0.0',
  'Openbare ruimte': '0.8.0.0.0',
  'Eet- of drankfestijn': '1.50.0.0.0',
  'Archeologische Site': '3CuHvenJ+EGkcvhXLg9Ykg',
  Bioscoop: 'BtVNd33sR0WntjALVbyp3w',
  Sportcentrum: 'eBwaUAAhw0ur0Z02i5ttnw',
  Horeca: 'ekdc4ATGoUitCa0e6me6xA',
  'Museum of galerij': 'GnPFp9uvOUyqhOckIFMKmg',
  'Jeugdhuis of jeugdcentrum': 'JCjA0i5COUmdjMwcyjNAFA',
  'Bibliotheek of documentatiecentrum': 'kI7uAyn2uUu9VV6Z3uWZTA',
  'Zaal of expohal': 'OyaPaf64AEmEAYXHeLMAtA',
  'School of onderwijscentrum': 'rJRFUqmd6EiqTD4c7HS90w',
  Winkel: 'VRC6HX0Wa063sq98G5ciqw',
  'Cultuur- of ontmoetingscentrum': 'Yf4aZBfsUEu2NsQqsprngw',
  Discotheek: 'YVBc8KVdrU6XfTNvhMYUpg',
} as const;

const MovieEventTypes = {
  CHOOSE_THEME: 'CHOOSE_THEME',
  CHANGE_THEME: 'CHANGE_THEME',
} as const;

type Theme = Values<typeof Themes>;

type MovieStateSchema = {
  value: any;
  context: any;
  states: {
    idle: {};
    themeChosen: {};
  };
};

type MovieEvent =
  | { type: typeof MovieEventTypes.CHOOSE_THEME; value: Theme }
  | { type: typeof MovieEventTypes.CHANGE_THEME };

type MovieContext = {
  offerType: typeof OfferType.EVENT;
  type: typeof Types.Film;
  theme: Theme;
};

const movieMachine = createMachine<MovieContext, MovieEvent, MovieStateSchema>({
  id: 'movie',
  initial: 'idle',
  context: {
    offerType: OfferType.EVENT,
    type: Types.Film,
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
        [MovieEventTypes.CHANGE_THEME]: {
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

export { movieMachine, Themes };
