import { fetchWithRedirect } from '../../utils/fetchWithRedirect';
import { useAuthenticatedQuery } from './useAuthenticatedQuery';
import { formatDate } from '../../utils/formatDate';

const getEventsToModerate = async (key, { headers, ...queryData }) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/events/`);
  url.search = new URLSearchParams({
    ...queryData,
    availableFrom: formatDate(new Date()),
  }).toString();
  const res = await fetchWithRedirect(url, {
    headers,
  });
  return await res.json();
};

const useGetEventsToModerate = (searchQuery, config) =>
  useAuthenticatedQuery(
    [
      'events',
      {
        q: searchQuery,
        audienceType: 'everyone',
        availableTo: '*',
        limit: 1,
        start: 0,
        workflowStatus: 'READY_FOR_VALIDATION',
      },
    ],
    getEventsToModerate,
    {
      enabled: !!searchQuery,
      ...config,
    },
  );

const getEventById = async (key, { headers, id }) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/event/${id.toString()}`;
  const res = await fetch(url, {
    headers,
  });
  return await res.json();
};

const useGetEventbyId = ({ id = '' }, config) =>
  useAuthenticatedQuery(
    [
      'events',
      {
        id,
      },
    ],
    getEventById,
    {
      enabled: !!id,
      ...config,
    },
  );

const getEventsByIds = async (key, { ids }) => {
  const mappedEvents = ids.map((eventId) => {
    return getEventById({ id: eventId });
  });

  const events = await Promise.all(mappedEvents);
  return events.filter((event) => !event.status);
};

const useGetEventsbyIds = ({ ids = [] }, config) =>
  useAuthenticatedQuery(
    [
      'events',
      {
        ids,
      },
    ],
    getEventsByIds,
    {
      enabled: ids.length > 0,
      ...config,
    },
  );

export { useGetEventsToModerate, useGetEventbyId, useGetEventsbyIds };
