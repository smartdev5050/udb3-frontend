import { Scope, ScopeTypes } from '@/constants/OfferType';
import { useGetOrganizerByIdQuery } from '@/hooks/api/organizers';
import { useGetOfferByIdQuery } from '@/hooks/api/offers';

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
