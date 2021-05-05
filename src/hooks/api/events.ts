import type { UseQueryOptions } from 'react-query';

import type { OfferStatus } from '@/constants/OfferStatus';
import type { Values } from '@/types/Values';
import { fetchFromApi, isErrorObject } from '@/utils/fetchFromApi';
import { formatDate } from '@/utils/formatDate';

import {
  useAuthenticatedMutation,
  useAuthenticatedQueries,
  useAuthenticatedQuery,
} from './authenticated-query';
import type { Headers } from './types/Headers';
import type { ServerSideArguments } from './types/ServerSideArguments';
import type { SortOptions } from './types/SortOptions';

type HeadersAndQueryData = {
  headers: Headers;
} & { [x: string]: string };

type GetEventsToModerateArguments = HeadersAndQueryData;

const getEventsToModerate = async ({
  headers,
  ...queryData
}: GetEventsToModerateArguments) => {
  const res = await fetchFromApi({
    path: '/events/',
    searchParams: {
      ...queryData,
      availableFrom: formatDate(new Date()),
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

const useGetEventsToModerate = (
  searchQuery: string,
  configuration: UseQueryOptions = {},
) =>
  useAuthenticatedQuery({
    queryKey: ['events'],
    queryFn: getEventsToModerate,
    queryArguments: {
      q: searchQuery,
      audienceType: 'everyone',
      availableTo: '*',
      limit: 1,
      start: 0,
      workflowStatus: 'READY_FOR_VALIDATION',
    },
    enabled: !!searchQuery,
    ...configuration,
  });

type GetEventByIdArguments = {
  headers: Headers;
  id: string;
};

const getEventById = async ({ headers, id }: GetEventByIdArguments) => {
  const res = await fetchFromApi({
    path: `/event/${id.toString()}`,
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

type UseGetEventsByIdArguments = ServerSideArguments & {
  id: string;
};

const useGetEventById = (
  { req, queryClient, id }: UseGetEventsByIdArguments,
  configuration: UseQueryOptions = {},
) =>
  useAuthenticatedQuery({
    req,
    queryClient,
    queryKey: ['events'],
    queryFn: getEventById,
    queryArguments: { id },
    enabled: !!id,
    ...configuration,
  });

type UseGetEventsByIdsArguments = ServerSideArguments & {
  ids: string[];
};

const useGetEventsByIds = ({
  req,
  queryClient,
  ids = [],
}: UseGetEventsByIdsArguments) => {
  const options = ids.map((id) => ({
    queryKey: ['events'],
    queryFn: getEventById,
    queryArguments: { id },
    enabled: !!id,
  }));

  return useAuthenticatedQueries({ req, queryClient, options });
};

type GetEventsByCreatorArguments = HeadersAndQueryData;

const getEventsByCreator = async ({
  headers,
  ...queryData
}: GetEventsByCreatorArguments) => {
  const res = await fetchFromApi({
    path: '/events/',
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

type UseGetEventsByCreatorArguments = {
  creator: { id: string; email: string };
  start: number;
  limit: number;
  sortOptions: SortOptions;
};

const useGetEventsByCreator = (
  {
    creator,
    start = 0,
    limit = 50,
    sortOptions = { field: 'modified', order: 'desc' },
  }: UseGetEventsByCreatorArguments,
  configuration: UseQueryOptions = {},
) =>
  useAuthenticatedQuery({
    queryKey: ['events'],
    queryFn: getEventsByCreator,
    queryArguments: {
      q: `creator:(${creator.id} OR ${creator.email})`,
      disableDefaultFilters: true,
      embed: true,
      limit,
      start,
      workflowStatus: 'DRAFT,READY_FOR_VALIDATION,APPROVED,REJECTED',
      [`sort[${sortOptions.field}}]`]: `${sortOptions.order}`,
    },
    configuration: {
      enabled: !!(creator.id && creator.email),
      ...configuration,
    },
  });

type GetCalendarSummaryArguments = {
  headers: Headers;
  id: string;
  format: string;
  locale: string;
};

const getCalendarSummary = async ({
  headers,
  id,
  format,
  locale,
}: GetCalendarSummaryArguments) => {
  const res = await fetchFromApi({
    path: `/events/${id.toString()}/calsum`,
    searchParams: {
      format,
      langCode: `${locale}_BE`,
    },
    options: {
      headers,
    },
  });
  if (isErrorObject(res)) {
    // eslint-disable-next-line no-console
    return console.error(res);
  }
  return res.text();
};

type UseGetCalendarSummaryArguments = {
  id: string;
  format: string;
  locale: string;
};

const useGetCalendarSummary = (
  { id, locale, format = 'lg' }: UseGetCalendarSummaryArguments,
  configuration: UseQueryOptions = {},
) =>
  useAuthenticatedQuery({
    queryKey: ['events'],
    queryFn: getCalendarSummary,
    queryArguments: {
      id,
      locale,
      format,
    },
    configuration: {
      enabled: !!id && !!locale,
      ...configuration,
    },
  });

type ChangeStatusArguments = {
  headers: Headers;
  id: string;
  type: Values<typeof OfferStatus>;
  reason: { [language: string]: string };
};

const changeStatus = async ({
  headers,
  id,
  type,
  reason,
}: ChangeStatusArguments) =>
  fetchFromApi({
    path: `/events/${id.toString()}/status`,
    options: {
      method: 'PUT',
      headers,
      body: JSON.stringify({ type, reason }),
    },
  });

const useChangeStatus = (configuration: UseQueryOptions = {}) =>
  useAuthenticatedMutation({ mutationFn: changeStatus, ...configuration });

type ChangeStatusSubEventsArguments = {
  headers: Headers;
  eventId: string;
  subEventIds: string[];
  subEvents: unknown[];
  type: Values<typeof OfferStatus>;
  reason: { [language: string]: string };
};

const changeStatusSubEvents = async ({
  headers,
  eventId,
  subEventIds = [],
  subEvents = [],
  type,
  reason,
}: ChangeStatusSubEventsArguments) =>
  fetchFromApi({
    path: `/events/${eventId.toString()}/subEvents`,
    options: {
      method: 'PATCH',
      headers,
      body: JSON.stringify(
        subEventIds.map((id) => ({
          id,
          status: {
            type,
            reason: {
              ...(subEvents[id].status.type === type &&
                subEvents[id].status.reason),
              ...reason,
            },
          },
        })),
      ),
    },
  });

const useChangeStatusSubEvents = (configuration: UseQueryOptions = {}) =>
  useAuthenticatedMutation({
    mutationFn: changeStatusSubEvents,
    ...configuration,
  });

export {
  useChangeStatus,
  useChangeStatusSubEvents,
  useGetCalendarSummary,
  useGetEventById,
  useGetEventsByCreator,
  useGetEventsByIds,
  useGetEventsToModerate,
};
