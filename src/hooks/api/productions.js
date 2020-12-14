import { fetchWithRedirect } from '../../utils/fetchWithRedirect';
import { useAuthenticatedMutation } from './useAuthenicatedMutation';
import { useAuthenticatedQuery } from './useAuthenticatedQuery';

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
    queryFunction: getProductions,
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

const useDeleteEventById = (configuration) =>
  useAuthenticatedMutation(deleteEventById, configuration);

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

const useDeleteEventsByIds = (configuration) =>
  useAuthenticatedMutation(deleteEventsByIds, configuration);

export { useGetProductions, useDeleteEventById, useDeleteEventsByIds };
