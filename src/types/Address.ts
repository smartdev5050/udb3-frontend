import type { SupportedLanguage } from '../i18n';

type AddressInternal = {
  addressCountry: string;
  addressLocality: string;
  postalCode: string;
  streetAddress: string;
};
type Address =
  | AddressInternal
  | { [key in SupportedLanguage]: AddressInternal };

export type { Address };
