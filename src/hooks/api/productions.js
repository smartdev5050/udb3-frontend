import { fetchFromApi } from '../../utils/fetchFromApi';
import {
  useAuthenticatedQuery,
  useAuthenticatedMutation,
} from './authenticated-query';

const getProductions = async ({ headers, ...queryData }) => {
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
  { name = '', start = 0, limit = 15 },
  configuration = {},
) =>
  useAuthenticatedQuery({
    queryKey: ['productions'],
    queryFn: getProductions,
    queryArguments: {
      name,
      start,
      limit,
    },
    configuration,
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
  const res = fetchFromApi({
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

export {
  useGetProductions,
  useDeleteEventById,
  useDeleteEventsByIds,
  useAddEventById,
  useAddEventsByIds,
};
