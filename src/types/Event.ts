import type { Offer } from './Offer';

type ProductionOnEvent = {
  id: string;
  title: string;
  otherEvents: string[];
};

type Event = Offer & {
  '@context': '/contexts/event';
  production?: ProductionOnEvent;
};

const isEvent = (value: unknown): value is Event => {
  return value['@context'] === '/contexts/event';
};

export { isEvent };
export type { Event };
