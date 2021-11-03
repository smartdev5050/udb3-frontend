import type { SupportedLanguages } from '../i18n';
import type { Values } from './Values';

type AddressInternal = {
  addressCountry: string;
  addressLocality: string;
  postalCode: string;
  streetAddress: string;
};
type Address =
  | AddressInternal
  | Partial<Record<Values<typeof SupportedLanguages>, AddressInternal>>;

export type { Address, AddressInternal };
