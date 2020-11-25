const { fetchWithRedirect } = require('../../utils/fetchWithRedirect');
const { useCookiesWithOptions } = require('../useCookiesWithOptions');
const { useAuthenticatedQuery } = require('./useAuthenticatedQuery');
const { useHeaders } = require('./useHeaders');

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
  const [cookies] = useCookiesWithOptions(['token']);
  const headers = useHeaders();
  return useAuthenticatedQuery(
    'findToModerate',
    () => findToModerate(headers, searchQuery),
    {
      enabled: cookies.token && searchQuery,
      ...config,
    },
  );
};

export { useFindToModerate };
