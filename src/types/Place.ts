import type { Address } from './Address';
import type { Offer } from './Offer';

type Place = Offer & {
  '@context': '/contexts/place';
  address: Address;
  geo: {
    latitude: number;
    longitude: number;
  };
};

const isPlace = (value: unknown): value is Event => {
  if (typeof value?.['@context'] !== 'string') return false;
  return value['@context'].endsWith('/place');
};

const arePlaces = (value: any): value is Place => {
  return value.every(isPlace);
};

export type { Place };
export { arePlaces };
