import { Values } from '@/types/Values';

const OfferTypes = {
  EVENTS: 'events',
  PLACES: 'places',
} as const;

type OfferType = Values<typeof OfferTypes>;

type Scope = OfferType | 'organizers';

export type { OfferType, Scope };
export { OfferTypes };
