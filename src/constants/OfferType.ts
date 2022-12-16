import { Values } from '@/types/Values';

const OfferTypes = {
  EVENTS: 'events',
  PLACES: 'places',
} as const;

type OfferType = Values<typeof OfferTypes>;

export type { OfferType };
export { OfferTypes };
