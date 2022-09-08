import type { Offer } from './Offer';
import type { Place } from './Place';
import { Values } from './Values';

type EventId = string;

type ProductionOnEvent = {
  id: string;
  title: string;
  otherEvents: EventId[];
};

const AttendenceModes = {
  OFFLINE: 'offline',
  ONLINE: 'online',
  MIXED: 'mixed',
} as const;

type Event = Offer & {
  '@context': '/contexts/event';
  location: Place;
  production?: ProductionOnEvent;
  attendanceMode: Values<typeof AttendenceModes>;
};

const isEvent = (value: unknown): value is Event => {
  if (typeof value?.['@context'] !== 'string') return false;
  return value['@context'].endsWith('/event');
};

const areEvents = (value: unknown[]): value is Event[] => {
  return value.every(isEvent);
};

export { areEvents, AttendenceModes, isEvent };
export type { Event, EventId };
