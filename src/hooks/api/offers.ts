import type { UseQueryOptions } from 'react-query';

import { Offer } from '@/types/Offer';
import type { User } from '@/types/User';
import { createEmbededCalendarSummaries } from '@/utils/createEmbededCalendarSummaries';
import { createSortingArgument } from '@/utils/createSortingArgument';
import { fetchFromApi, isErrorObject } from '@/utils/fetchFromApi';

import type {
  AuthenticatedQueryOptions,
  CalendarSummaryFormats,
  PaginationOptions,
  SortOptions,
} from './authenticated-query';
import { useAuthenticatedQuery } from './authenticated-query';

const getOffersByCreator = async ({ headers, ...queryData }) => {
  const res = await fetchFromApi({
    path: '/offers/',
    searchParams: {
      ...queryData,
    },
    options: {
      headers,
    },
  });
  if (isErrorObject(res)) {
    // eslint-disable-next-line no-console
    return console.error(res);
  }
  return await res.json();
};

const useGetOffersByCreatorQuery = (
  {
    req,
    queryClient,
    advancedQuery,
    creator,
    paginationOptions = { start: 0, limit: 50 },
    sortOptions = { field: 'modified', order: 'desc' },
    calendarSummaryFormats = ['lg-text', 'sm-text'],
  }: AuthenticatedQueryOptions<
    PaginationOptions &
      SortOptions &
      CalendarSummaryFormats & {
        creator: User;
        advancedQuery?: string;
      }
  >,
  configuration: UseQueryOptions = {},
) => {
  const defaultQuery = `creator:(${creator.id} OR ${creator.email})`;
  const query = advancedQuery
    ? defaultQuery.concat(' AND ', advancedQuery)
    : defaultQuery;
  return useAuthenticatedQuery<Offer[]>({
    req,
    queryClient,
    queryKey: ['events'],
    queryFn: getOffersByCreator,
    queryArguments: {
      q: query,
      disableDefaultFilters: true,
      embed: true,
      limit: paginationOptions.limit,
      start: paginationOptions.start,
      workflowStatus: 'DRAFT,READY_FOR_VALIDATION,APPROVED,REJECTED',
      ...createSortingArgument(sortOptions),
      ...(calendarSummaryFormats &&
        createEmbededCalendarSummaries(calendarSummaryFormats)),
    },
    enabled: !!(creator.id && creator.email),
    ...configuration,
  });
};

export { useGetOffersByCreatorQuery };
