type AddressInternal = {
  addressCountry: string;
  addressLocality: string;
  postalCode: string;
  streetAddress: string;
};
type Address =
  | AddressInternal
  | { nl: AddressInternal }
  | { fr: AddressInternal };

export type { Address };
