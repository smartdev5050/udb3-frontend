/* eslint-disable no-console */
import MockSuggestedEvents from '../assets/suggested-events';
const enviroment = process.env.NODE_ENV;

export const find = (apiUrl, headers, fetch) => async ({
  name = '',
  start = 0,
  limit = 10,
} = {}) => {
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

export const getSuggestedEvents = (apiUrl, headers, fetch) => async () => {
  // TODO: change suggestion to suggestion/
  const url = `${apiUrl}/productions/suggestion`;
  const res = await fetch(url, {
    headers: headers(),
  });
  if (enviroment === 'development') {
    console.log({
      type: 'GET',
      url,
    });
    return MockSuggestedEvents;
  }
  return await res.json();
};

export const skipSuggestedEvents = (apiUrl, headers, fetch) => async (
  eventIds = [],
) => {
  const url = `${apiUrl}/productions/skip`;
  const res = await fetch(url, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      eventIds,
    }),
  });
  if (enviroment === 'development') {
    console.log({
      type: 'POST',
      url,
      body: {
        eventIds,
      },
    });
  }
  const body = await res.text();
  if (body) {
    return JSON.parse(body);
  }
  return {};
};

export const createWithEvents = (apiUrl, headers, fetch) => async ({
  name = '',
  eventIds = [],
} = {}) => {
  const url = `${apiUrl}/productions/`;
  const res = await fetch(url, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      name,
      eventIds,
    }),
  });
  if (enviroment === 'development') {
    console.log({
      type: 'POST',
      url,
      body: {
        name,
        eventIds,
      },
    });
  }
  const body = await res.text();
  if (body) {
    return JSON.parse(body);
  }
  return {};
};
