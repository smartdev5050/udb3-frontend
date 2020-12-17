import { fetchFromApi } from '../../utils/fetchFromApi';
import { useAuthenticatedQuery } from './useAuthenticatedQuery';
import { formatDate } from '../../utils/formatDate';

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

export { useGetEventsToModerate };
