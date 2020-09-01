import getMockedEventsSet from '../functions/getMockedEventsSet';
import { Environments } from './api';

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

export const addEventsByIds = (apiUrl, headers, fetch) => async ({
  productionId = '',
  eventIds = [],
} = {}) => {
  const mappedEvents = eventIds.map((eventId) => {
    return addEventById(apiUrl, headers, fetch)(productionId, eventId);
  });
  return await Promise.all(mappedEvents);
};

export const deleteEventById = (apiUrl, headers, fetch) => async (
  productionId,
  eventId,
) => {
  const url = new URL(
    `${apiUrl}/productions/${productionId}/events/${eventId}`,
  );

  return await fetch(url, {
    method: 'DELETE',
    headers: headers(),
  });
};

export const deleteEventsByIds = (apiUrl, headers, fetch) => async ({
  productionId = '',
  eventIds = [],
} = {}) => {
  const mappedEvents = eventIds.map((eventId) => {
    return deleteEventById(apiUrl, headers, fetch)(productionId, eventId);
  });
  return await Promise.all(mappedEvents);
};

export const getSuggestedEvents = (
  apiUrl,
  headers,
  fetch,
  environment,
  debug,
) => async () => {
  const url = `${apiUrl}/productions/suggestion`;

  if (environment === Environments.DEVELOPMENT) {
    debug({
      type: 'GET',
      url,
    });
    return getMockedEventsSet();
  }

  const response = await fetch(url, {
    headers: headers(),
  });

  if (response.status === 404) {
    return [];
  }

  const { events = [] } = await response.json();
  return events;
};

export const skipSuggestedEvents = (
  apiUrl,
  headers,
  fetch,
  environment,
  debug,
) => async (eventIds = []) => {
  const url = `${apiUrl}/productions/skip`;

  if (environment === Environments.DEVELOPMENT) {
    debug({
      type: 'POST',
      url,
      body: {
        eventIds,
      },
    });
    return;
  }

  await fetch(url, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      eventIds,
    }),
  });
};

export const createWithEvents = (apiUrl, headers, fetch) => async ({
  name = '',
  eventIds = [],
} = {}) => {
  const url = `${apiUrl}/productions/`;
  const response = await fetch(url, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      name,
      eventIds,
    }),
  });

  const body = await response.text();
  if (body) {
    return JSON.parse(body);
  }
  return {};
};

export const mergeProductions = (apiUrl, headers, fetch) => async ({
  fromProductionId = '',
  toProductionId = '',
} = {}) => {
  const url = `${apiUrl}/productions/${toProductionId}/merge/${fromProductionId}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: headers(),
  });

  const body = await response.text();
  if (body) {
    return JSON.parse(body);
  }
  return {};
};
