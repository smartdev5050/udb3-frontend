import type { Offer } from './Offer';
import type { Place } from './Place';

type EventId = string;

type ProductionOnEvent = {
  id: string;
  title: string;
  otherEvents: EventId[];
};

type Event = Offer & {
  '@context': '/contexts/event';
  location: Place;
  production?: ProductionOnEvent;
};

const isEvent = (value: unknown): value is Event => {
  if (typeof value?.['@context'] !== 'string') return false;
  return value['@context'].endsWith('/event');
};

const areEvents = (value: unknown[]): value is Event[] => {
  return value.every(isEvent);
};

export { areEvents, isEvent };
export type { Event, EventId };
