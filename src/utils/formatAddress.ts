import type { AddressInternal } from '@/types/Address';

const formatAddressInternal = (addressInternal: AddressInternal) => {
  return `${addressInternal.streetAddress} ${addressInternal.postalCode} ${addressInternal.addressLocality}`;
};

export { formatAddressInternal };
