import { fetchWithRedirect } from '../../utils/fetchWithRedirect';
import {
  useAuthenticatedQuery,
  useAuthenticatedMutation,
} from './authenticated-query';

const getProductions = async ({ headers, ...queryData }) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/productions/`);
  url.search = new URLSearchParams({
    ...queryData,
  }).toString();
  const res = await fetch(url, {
    headers,
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
  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/productions/${productionId}/events/${eventId}`,
  );

  return await fetchWithRedirect(url, {
    method: 'DELETE',
    headers,
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
  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/productions/${productionId}/events/${eventId}`,
  );
  const res = await fetch(url, {
    method: 'PUT',
    headers,
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
