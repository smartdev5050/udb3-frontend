import { fetchWithRedirect } from '../../utils/fetchWithRedirect';
import { useAuthenticatedQuery } from './useAuthenticatedQuery';
import { formatDate } from '../../utils/formatDate';

const getEventsToModerate = async ({ headers, ...queryData }) => {
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

const useGetEventsToModerate = (searchQuery, configuration) =>
  useAuthenticatedQuery({
    queryKey: ['events'],
    queryFunction: getEventsToModerate,
    queryArguments: {
      q: searchQuery,
      audienceType: 'everyone',
      availableTo: '*',
      limit: 1,
      start: 0,
      workflowStatus: 'READY_FOR_VALIDATION',
    },
    configuration: {
      enabled: !!searchQuery,
      ...configuration,
    },
  });

const getEventById = async ({ headers, id }) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/event/${id.toString()}`;
  const res = await fetchWithRedirect(url, {
    headers,
  });
  return await res.json();
};

const useGetEventbyId = ({ id = '' }, configuration) =>
  useAuthenticatedQuery({
    queryKey: ['events'],
    queryFunction: getEventById,
    queryArguments: { id },
    configuration: {
      enabled: !!id,
      ...configuration,
    },
  });

const getEventsByIds = async ({ ids, headers }) => {
  const mappedEvents = ids.map((eventId) =>
    getEventById({ headers, id: eventId }),
  );
  return Promise.all(mappedEvents);
};

const useGetEventsbyIds = ({ ids = [] }, configuration) =>
  useAuthenticatedQuery({
    queryKey: ['events'],
    queryFunction: getEventsByIds,
    queryArguments: { ids },
    configuration: {
      enabled: ids.length > 0,
      ...configuration,
    },
  });

const getCalendarSummary = async ({ headers, id, format, locale }) => {
  const url = `${
    process.env.NEXT_PUBLIC_API_URL
  }/events/${id.toString()}/calsum?format=${format}&langCode=${locale}_BE`;
  const res = await fetchWithRedirect(url, {
    headers,
  });
  return res.text();
};

const useGetCalendarSummary = ({ id, locale, format = 'lg' }, configuration) =>
  useAuthenticatedQuery({
    queryKey: ['events'],
    queryFunction: getCalendarSummary,
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

export {
  useGetEventsToModerate,
  useGetEventbyId,
  useGetEventsbyIds,
  useGetCalendarSummary,
};
