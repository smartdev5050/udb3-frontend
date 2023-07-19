import { Scope, ScopeTypes } from '@/constants/OfferType';
import { useGetOfferByIdQuery } from '@/hooks/api/offers';
import { useGetOrganizerByIdQuery } from '@/hooks/api/organizers';

const getEntityQueryForScope = (scope: Scope) =>
  scope === ScopeTypes.ORGANIZERS
    ? useGetOrganizerByIdQuery
    : useGetOfferByIdQuery;

const useGetEntityByIdAndScope = ({
  scope,
  id,
  ...rest
}: {
  scope: Scope;
  id: string;
}) => {
  const query = getEntityQueryForScope(scope);

  return query({ scope, id, ...rest });
};

export { getEntityQueryForScope, useGetEntityByIdAndScope };
