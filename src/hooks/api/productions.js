import { Errors, fetchFromApi } from '../../utils/fetchFromApi';
import { suggestedEvents } from '../../mocked/suggestedEvents';
import {
  useAuthenticatedQuery,
  useAuthenticatedMutation,
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
  return await res.json();
};

const useGetProductions = (
  { req, queryClient, name = '', start = 0, limit = 15 },
  configuration = {},
) =>
  useAuthenticatedQuery({
    req,
    queryClient,
    queryKey: ['productions'],
    queryFn: getProductions,
    queryArguments: {
      name,
      start,
      limit,
    },
  });

const deleteEventById = async ({
  productionId = '',
  eventId = '',
  headers,
}) => {
  return await fetchFromApi({
    path: `/productions/${productionId}/events/${eventId}`,
    options: {
      method: 'DELETE',
      headers,
    },
  });
};

const useDeleteEventById = (configuration = {}) =>
  useAuthenticatedMutation({ mutationFn: deleteEventById, ...configuration });

const deleteEventsByIds = async ({
  productionId = '',
  eventIds = [],
  headers,
}) => {
  const mappedEvents = eventIds.map((eventId) => {
    return deleteEventById({ productionId, eventId, headers });
  });
  return await Promise.all(mappedEvents);
};

const useDeleteEventsByIds = (configuration = {}) =>
  useAuthenticatedMutation({ mutationFn: deleteEventsByIds, ...configuration });

const addEventById = async ({ productionId, eventId, headers }) => {
  const res = await fetchFromApi({
    path: `/productions/${productionId}/events/${eventId}`,
    options: {
      method: 'PUT',
      headers,
    },
  });
  const body = await res.text();
  if (body) {
    return JSON.parse(body);
  }
  return {};
};

const useAddEventById = (configuration) =>
  useAuthenticatedMutation({ mutationFn: addEventById, ...configuration });

const addEventsByIds = async ({
  productionId = '',
  eventIds = [],
  headers,
} = {}) => {
  const mappedEvents = eventIds.map((eventId) => {
    return addEventById({ headers, productionId, eventId });
  });
  return await Promise.all(mappedEvents);
};

const useAddEventsByIds = (configuration) =>
  useAuthenticatedMutation({ mutationFn: addEventsByIds, ...configuration });

const getSuggestedEvents = async ({ headers }) => {
  let res;
  try {
    res = await fetchFromApi({
      path: '/productions/suggestion',
      options: {
        headers,
      },
    });
  } catch (error) {
    if ([Errors['204'], Errors['404']].includes(error.message)) {
      return { events: [], similarity: 0 };
    }
    throw new Error(error.message);
  }
  return await res.json();
};

const useGetSuggestedEvents = (configuration = {}) =>
  useAuthenticatedQuery({
    queryKey: ['productions', 'suggestion'],
    queryFn: getSuggestedEvents,
    mockData: suggestedEvents,
    ...configuration,
  });

const skipSuggestedEvents = async ({ headers, eventIds }) => {
  const res = await fetchFromApi({
    path: '/productions/skip',
    options: {
      method: 'POST',
      headers,
      body: JSON.stringify({
        eventIds,
      }),
    },
  });
  const body = await res.text();
  if (body) {
    return JSON.parse(body);
  }
  return {};
};

const useSkipSuggestedEvents = (configuration) =>
  useAuthenticatedMutation({
    mutationFn: skipSuggestedEvents,
    ...configuration,
  });

export {
  useGetProductions,
  useDeleteEventById,
  useDeleteEventsByIds,
  useAddEventById,
  useAddEventsByIds,
  useGetSuggestedEvents,
  useSkipSuggestedEvents,
};
