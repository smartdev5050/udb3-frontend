import { fetchWithRedirect } from '../../utils/fetchWithRedirect';
import { useAuthenticatedMutation } from './useAuthenicatedMutation';
import { useAuthenticatedQuery } from './useAuthenticatedQuery';

const getProductions = async (key, { headers, ...queryData }) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/productions/`);
  url.search = new URLSearchParams({
    ...queryData,
  }).toString();
  const res = await fetch(url, {
    headers,
  });
  return await res.json();
};

const useGetProductions = ({ name = '', start = 0, limit = 15 }, config = {}) =>
  useAuthenticatedQuery(
    [
      'productions',
      {
        name,
        start,
        limit,
      },
    ],
    getProductions,
    config,
  );

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

const useDeleteEventById = (config) =>
  useAuthenticatedMutation(deleteEventById, config);

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

const useDeleteEventsByIds = (config) =>
  useAuthenticatedMutation(deleteEventsByIds, config);

export { useGetProductions, useDeleteEventById, useDeleteEventsByIds };
