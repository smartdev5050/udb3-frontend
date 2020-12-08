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
  const res = await fetchWithRedirect(url, {
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

const getEventsByIds = async (key, { ids, headers }) => {
  const mappedEvents = ids.map((eventId) =>
    getEventById(key, { headers, id: eventId }),
  );
  return Promise.all(mappedEvents);
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

const getCalendarSummary = async (key, { headers, id, format, locale }) => {
  const url = `${
    process.env.NEXT_PUBLIC_API_URL
  }/events/${id.toString()}/calsum?format=${format}&langCode=${locale}_BE`;
  const res = await fetchWithRedirect(url, {
    headers,
  });
  return res.text();
};

const useGetCalendarSummary = ({ id, locale, format = 'lg' }, config) =>
  useAuthenticatedQuery(
    [
      'events',
      {
        id,
        locale,
        format,
      },
    ],
    getCalendarSummary,
    {
      enabled: id && locale,
      ...config,
    },
  );

export {
  useGetEventsToModerate,
  useGetEventbyId,
  useGetEventsbyIds,
  useGetCalendarSummary,
};
