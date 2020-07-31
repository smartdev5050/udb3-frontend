import { fetchWithLogoutWhenFailed } from './api';

export const findToModerate = (apiUrl, headers) => async (
  searchQuery,
  start = 0,
  limit = 1,
) => {
  const url = new URL(`${apiUrl}/events/`);
  url.search = new URLSearchParams({
    q: searchQuery,
    audienceType: 'everyone',
    availableFrom: new Date().toISOString().split('.')[0] + 'Z',
    availableTo: '*',
    limit,
    start,
    workflowStatus: 'READY_FOR_VALIDATION',
  }).toString();

  const res = await fetchWithLogoutWhenFailed(url, {
    headers: headers(),
  });
  return await res.json();
};
