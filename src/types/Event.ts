import type { Offer } from './Offer';

type EventId = string;

type ProductionOnEvent = {
  id: string;
  title: string;
  otherEvents: EventId[];
};

type Event = Offer & {
  '@context': '/contexts/event';
  production?: ProductionOnEvent;
};

const isEvent = (value: unknown): value is Event => {
  return value['@context'] === '/contexts/event';
};

const areEvents = (value: unknown[]): value is Event[] => {
  return value.every(isEvent);
};

export { areEvents, isEvent };
export type { Event };
