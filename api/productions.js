export const find = (apiUrl, headers, fetch) => async (
  name = '',
  start = 0,
  limit = 10,
) => {
  const url = new URL(`${apiUrl}/productions/`);
  url.search = new URLSearchParams({
    name,
    start,
    limit,
  }).toString();
  const res = await fetch(url, {
    headers: headers(),
  });
  return await res.json();
};

export const addEventById = (apiUrl, headers, fetch) => async (
  productionId,
  eventId,
) => {
  const url = new URL(
    `${apiUrl}/productions/${productionId}/events/${eventId}`,
  );
  const res = await fetch(url, {
    method: 'PUT',
    headers: headers(),
  });
  const body = await res.text();
  if (body) {
    return JSON.parse(body);
  }
  return {};
};

export const deleteEventById = (apiUrl, headers, fetch) => async (
  productionId,
  eventId,
) => {
  const url = new URL(
    `${apiUrl}/productions/${productionId}/events/${eventId}`,
  );
  const res = await fetch(url, {
    method: 'DELETE',
    headers: headers(),
  });
  const body = await res.text();
  if (body) {
    return JSON.parse(body);
  }
  return {};
};
