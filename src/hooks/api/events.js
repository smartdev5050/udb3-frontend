import { fetchWithRedirect } from '../../utils/fetchWithRedirect';
import { useAuthenticatedQuery } from './useAuthenticatedQuery';
import { formatDate } from '../../utils/formatDate';

const getEventsToModerate = async (
  key,
  { headers, searchQuery, start = 0, limit = 1 },
) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/events/`);
  url.search = new URLSearchParams({
    q: searchQuery,
    audienceType: 'everyone',
    availableFrom: formatDate(new Date()),
    availableTo: '*',
    limit,
    start,
    workflowStatus: 'READY_FOR_VALIDATION',
  }).toString();

  const res = await fetchWithRedirect(url, {
    headers,
  });
  return await res.json();
};

const useGetEventsToModerate = (searchQuery, config) => {
  return useAuthenticatedQuery(
    ['getEventsToModerate', { searchQuery }],
    getEventsToModerate,
    {
      enabled: !!searchQuery,
      ...config,
    },
  );
};

export { useGetEventsToModerate };
