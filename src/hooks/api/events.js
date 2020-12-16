import { fetchWithRedirect } from '../../utils/fetchWithRedirect';
import {
  useAuthenticatedQueries,
  useAuthenticatedQuery,
} from './authenticated-query';
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

const useGetEventsToModerate = (searchQuery, configuration = {}) =>
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
  const url = `${process.env.NEXT_PUBLIC_API_URL}/event/${id.toString()}`;
  const res = await fetchWithRedirect(url, {
    headers,
  });
  return await res.json();
};

const useGetEventbyId = ({ id }, configuration) =>
  useAuthenticatedQuery({
    queryKey: ['events'],
    queryFn: getEventById,
    queryArguments: { id },
    enabled: !!id,
    ...configuration,
  });

const useGetEventsbyIds = ({ ids = [] }) => {
  const options = ids.map((id) => ({
    queryKey: ['events'],
    queryFn: getEventById,
    queryArguments: { id },
    enabled: !!id,
  }));

  return useAuthenticatedQueries(options);
};

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
    queryFn: getCalendarSummary,
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
