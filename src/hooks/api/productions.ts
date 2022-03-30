import { fetchFromApi, isErrorObject } from '@/utils/fetchFromApi';

import {
  useAuthenticatedMutation,
  useAuthenticatedMutations,
  useAuthenticatedQuery,
} from './authenticated-query';

export const getProductions = async ({ headers, ...queryData }) => {
  const res = await fetchFromApi({
    path: '/productions/',
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

const useGetProductionsQuery = (
  { req, queryClient, name = '', paginationOptions = { start: 0, limit: 15 } },
  configuration = {},
) =>
  useAuthenticatedQuery({
    req,
    queryClient,
    queryKey: ['productions'],
    queryFn: getProductions,
    queryArguments: {
      name,
      start: paginationOptions.start,
      limit: paginationOptions.limit,
    },
    ...configuration,
  });

const deleteEventById = async ({
  productionId = '',
  eventId = '',
  headers,
  silentError = false,
}) =>
  fetchFromApi({
    path: `/productions/${productionId}/events/${eventId}`,
    options: {
      method: 'DELETE',
      headers,
    },
    silentError,
  });

const useDeleteEventByIdMutation = (configuration = {}) =>
  useAuthenticatedMutation({ mutationFn: deleteEventById, ...configuration });

const deleteEventsByIds = async ({
  productionId = '',
  eventIds = [],
  headers,
}) =>
  Promise.all(
    eventIds.map(async (eventId) =>
      deleteEventById({ productionId, eventId, headers, silentError: true }),
    ),
  );

const useDeleteEventsByIdsMutation = (configuration = {}) =>
  useAuthenticatedMutations({
    mutationFns: deleteEventsByIds,
    ...configuration,
  });

const addEventById = async ({
  productionId,
  eventId,
  headers,
  silentError = false,
}) =>
  fetchFromApi({
    path: `/productions/${productionId}/events/${eventId}`,
    options: {
      method: 'PUT',
      headers,
    },
    silentError,
  });

const useAddEventByIdMutation = (configuration = {}) =>
  useAuthenticatedMutation({ mutationFn: addEventById, ...configuration });

const addEventsByIds = async ({ productionId = '', eventIds = [], headers }) =>
  Promise.all(
    eventIds.map(async (eventId) =>
      addEventById({ headers, productionId, eventId, silentError: true }),
    ),
  );

const useAddEventsByIdsMutation = (configuration = {}) =>
  useAuthenticatedMutations({ mutationFns: addEventsByIds, ...configuration });

const getSuggestedEvents = async ({ headers }) => {
  const response = await fetchFromApi({
    path: '/productions/suggestion',
    options: {
      headers,
    },
  });
  if (response.status !== 200 || isErrorObject(response)) {
    // eslint-disable-next-line no-console
    console.error(response);
    return { events: [], similarity: 0 };
  }
  return await response.json();
};

const useGetSuggestedEventsQuery = (configuration = {}) =>
  useAuthenticatedQuery({
    queryKey: ['productions', 'suggestion'],
    queryFn: getSuggestedEvents,
    ...configuration,
  });

const skipSuggestedEvents = async ({ headers, eventIds = [] }) =>
  fetchFromApi({
    path: '/productions/skip',
    options: {
      method: 'POST',
      headers,
      body: JSON.stringify({
        eventIds,
      }),
    },
  });

const useSkipSuggestedEventsMutation = (configuration = {}) =>
  useAuthenticatedMutation({
    mutationFn: skipSuggestedEvents,
    ...configuration,
  });

const createWithEvents = async ({ headers, productionName, eventIds = [] }) =>
  fetchFromApi({
    path: '/productions/',
    options: {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: productionName,
        eventIds,
      }),
    },
  });

const useCreateWithEventsMutation = (configuration = {}) =>
  useAuthenticatedMutation({ mutationFn: createWithEvents, ...configuration });

const mergeProductions = async ({
  headers,
  fromProductionId,
  toProductionId,
}) =>
  fetchFromApi({
    path: `/productions/${toProductionId}/merge/${fromProductionId}`,
    options: { method: 'POST', headers },
  });

const useMergeProductionsMutation = (configuration = {}) =>
  useAuthenticatedMutation({ mutationFn: mergeProductions, ...configuration });

const changeProductionName = async ({
  productionId = '',
  productionName = '',
  headers,
  silentError = false,
}) =>
  fetchFromApi({
    path: `/productions/${productionId}/name`,
    options: {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        name: productionName,
      }),
    },
    silentError,
  });

const useChangeProductionNameMutation = (configuration = {}) =>
  useAuthenticatedMutation({
    mutationFn: changeProductionName,
    ...configuration,
  });

export {
  useAddEventByIdMutation,
  useAddEventsByIdsMutation,
  useChangeProductionNameMutation,
  useCreateWithEventsMutation,
  useDeleteEventByIdMutation,
  useDeleteEventsByIdsMutation,
  useGetProductionsQuery,
  useGetSuggestedEventsQuery,
  useMergeProductionsMutation,
  useSkipSuggestedEventsMutation,
};
