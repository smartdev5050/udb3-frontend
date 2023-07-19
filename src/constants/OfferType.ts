import { Values } from '@/types/Values';

const OfferTypes = {
  EVENTS: 'events',
  PLACES: 'places',
} as const;

const ScopeTypes = { ...OfferTypes, ORGANIZERS: 'organizers' };

type OfferType = Values<typeof OfferTypes>;
type Scope = Values<typeof ScopeTypes>;

export type { OfferType, Scope };
export { OfferTypes, ScopeTypes };
