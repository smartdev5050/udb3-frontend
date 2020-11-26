import { fetchWithRedirect } from '../../utils/fetchWithRedirect';
import { useAuthenticatedQuery } from './useAuthenticatedQuery';

const findToModerate = async (headers, searchQuery, start = 0, limit = 1) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/events/`);
  url.search = new URLSearchParams({
    q: searchQuery,
    audienceType: 'everyone',
    availableFrom: new Date().toISOString().split('.')[0] + 'Z',
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

const useFindToModerate = (searchQuery, config) => {
  return useAuthenticatedQuery(
    'findToModerate',
    (headers) => findToModerate(headers, searchQuery),
    config,
  );
};

export { useFindToModerate };
