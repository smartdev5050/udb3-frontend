export const findToModerate = (apiUrl, headers, fetch) => async (
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

  const res = await fetch(url, {
    headers: headers(),
  });
  return await res.json();
};

export const findById = (apiUrl, headers, fetch) => async (id) => {
  const url = `${apiUrl}/event/${id.toString()}`;
  const res = await fetch(url, {
    headers: headers(),
  });
  return await res.json();
};

export const findByIds = (apiUrl, headers, fetch) => async (eventIds) => {
  const mappedEvents = eventIds.map((eventId) => {
    return findById(apiUrl, headers, fetch)(eventId);
  });

  const events = await Promise.all(mappedEvents);
  return events.filter((event) => !event.status);
};
