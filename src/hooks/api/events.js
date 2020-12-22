import { Errors, fetchFromApi } from '../../utils/fetchFromApi';
import {
  useAuthenticatedQuery,
  useAuthenticatedQueries,
} from './authenticated-query';
import { formatDate } from '../../utils/formatDate';
import { suggestedEvents } from '../../mocked/suggestedEvents';

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

const getEventsToModerate = async ({ headers, ...queryData }) => {
  const res = await fetchFromApi({
    path: '/events/',
    searchParams: {
      ...queryData,
      availableFrom: formatDate(new Date()),
    },
    options: {
      headers,
    },
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
  const res = await fetchFromApi({
    path: `/event/${id.toString()}`,
    options: {
      headers,
    },
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

const useGetEventsbyIds = ({ req, queryClient, ids = [] }) => {
  const options = ids.map((id) => ({
    queryKey: ['events'],
    queryFn: getEventById,
    queryArguments: { id },
    enabled: !!id,
  }));

  return useAuthenticatedQueries({ req, queryClient, options });
};

const getCalendarSummary = async ({ headers, id, format, locale }) => {
  const res = await fetchFromApi({
    path: `/events/${id.toString()}/calsum?format=${format}&langCode=${locale}_BE`,
    options: {
      headers,
    },
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
  useGetSuggestedEvents,
  useGetEventsToModerate,
  useGetEventbyId,
  useGetEventsbyIds,
  useGetCalendarSummary,
};
