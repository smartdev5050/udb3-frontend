import { uniqBy } from 'lodash';

import { useGetOffersByCreatorQuery } from '@/hooks/api/offers';
import { useGetUserQuery } from '@/hooks/api/user';
import { Offer } from '@/types/Offer';

const useRecentLocations = () => {
  const getUserQuery = useGetUserQuery();
  const getOffersQuery = useGetOffersByCreatorQuery(
    {
      advancedQuery: '_exists_:location.id AND NOT (audienceType:"education")',
      // @ts-expect-error
      creator: getUserQuery?.data,
      sortOptions: {
        field: 'modified',
        order: 'desc',
      },
      paginationOptions: { start: 0, limit: 20 },
    },
    {
      queryArguments: {
        workflowStatus: 'DRAFT,READY_FOR_VALIDATION,APPROVED',
        addressCountry: '*',
      },
    },
  );

  const offers: (Offer & { location: any })[] =
    // @ts-expect-error
    getOffersQuery?.data?.member ?? [];

  const hasRecentLocations = offers?.length > 0;

  const recentLocations = uniqBy(
    offers?.map((offer) => offer.location),
    '@id',
  )
    .filter(
      (location) =>
        location &&
        location?.name?.nl !== 'Online' &&
        !('duplicateOf' in location),
    )
    .slice(0, 4);

  return { recentLocations, hasRecentLocations };
};

export { useRecentLocations };
