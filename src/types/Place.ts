import type { Address } from './Address';
import type { BaseOffer } from './Offer';

type Place = BaseOffer & {
  '@context': '/contexts/place';
  address: Address;
  geo: {
    latitude: number;
    longitude: number;
  };
};

const isPlace = (value: unknown): value is Place => {
  if (typeof value?.['@context'] !== 'string') return false;
  return value['@context'].endsWith('/place');
};

const arePlaces = (value: unknown): value is Place[] => {
  if (!Array.isArray(value)) return false;
  return value.every(isPlace);
};

export type { Place };
export { arePlaces, isPlace };
