import type { UseQueryOptions } from 'react-query';

import { createSortingArgument } from '@/utils/createSortingArgument';
import { fetchFromApi, isErrorObject } from '@/utils/fetchFromApi';
import { formatDate } from '@/utils/formatDate';

import {
  useAuthenticatedMutation,
  useAuthenticatedQueries,
  useAuthenticatedQuery,
} from './authenticated-query';

const getEventsToModerate = async ({ headers, queryKey, ...queryData }) => {
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

const useGetEventsToModerate = (searchQuery, configuration) =>
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

const getEventById = async ({ headers, id }) => {
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

const useGetEventById = ({ req, queryClient, id }, configuration = {}) =>
  useAuthenticatedQuery({
    req,
    queryClient,
    queryKey: ['events'],
    queryFn: getEventById,
    queryArguments: { id },
    enabled: !!id,
    ...configuration,
  });

const useGetEventsByIds = ({ req, queryClient, ids = [] }) => {
  const options = ids.map((id) => ({
    queryKey: ['events'],
    queryFn: getEventById,
    queryArguments: { id },
    enabled: !!id,
  }));

  return useAuthenticatedQueries({ req, queryClient, options });
};

const deleteEventById = async ({ headers, id }) =>
  fetchFromApi({
    path: `/events/${id}`,
    options: { headers, method: 'DELETE' },
  });

const useDeleteEventById = (configuration = {}) =>
  useAuthenticatedMutation({
    mutationFn: deleteEventById,
    ...configuration,
  });

const getEventsByCreator = async ({ headers, ...queryData }) => {
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

const useGetEventsByCreator = (
  {
    req,
    queryClient,
    creator,
    paginationOptions = { start: 0, limit: 50 },
    sortOptions = { field: 'modified', order: 'desc' },
  },
  configuration = {},
) =>
  useAuthenticatedQuery({
    req,
    queryClient,
    queryKey: ['events'],
    queryFn: getEventsByCreator,
    queryArguments: {
      q: `creator:(${creator.id} OR ${creator.email})`,
      disableDefaultFilters: true,
      embed: true,
      limit: paginationOptions.limit,
      start: paginationOptions.start,
      workflowStatus: 'DRAFT,READY_FOR_VALIDATION,APPROVED,REJECTED',
      ...createSortingArgument(sortOptions),
      embedCalendarSummaries: 'md-text',
    },
    enabled: !!(creator.id && creator.email),
    ...configuration,
  });

const getCalendarSummary = async ({ headers, id, format, locale }) => {
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

const useGetCalendarSummary = (
  { id, locale, format = 'lg' },
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
    enabled: !!id && !!locale,
    ...configuration,
  });

const changeStatus = async ({ headers, id, type, reason }) =>
  fetchFromApi({
    path: `/events/${id.toString()}/status`,
    options: {
      method: 'PUT',
      headers,
      body: JSON.stringify({ type, reason }),
    },
  });

const useChangeStatus = (configuration) =>
  useAuthenticatedMutation({ mutationFn: changeStatus, ...configuration });

const changeStatusSubEvents = async ({
  headers,
  eventId,
  subEventIds = [],
  subEvents = [],
  type,
  reason,
}) =>
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

const useChangeStatusSubEvents = (configuration) =>
  useAuthenticatedMutation({
    mutationFn: changeStatusSubEvents,
    ...configuration,
  });

export {
  useChangeStatus,
  useChangeStatusSubEvents,
  useDeleteEventById,
  useGetCalendarSummary,
  useGetEventById,
  useGetEventsByCreator,
  useGetEventsByIds,
  useGetEventsToModerate,
};
