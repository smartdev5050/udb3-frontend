import type { EventId } from './Event';

type Production = {
  // eslint-disable-next-line camelcase
  production_id: string;
  name: string;
  events: EventId[];
};

export type { Production };
