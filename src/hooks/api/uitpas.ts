import { UseQueryOptions } from 'react-query';

import { fetchFromApi, isErrorObject } from '@/utils/fetchFromApi';

import { useAuthenticatedQuery } from './authenticated-query';

type CardSystem = {
  id: number;
  name: string;
  distributionKeys?: any[];
};

type CardSystems = {
  [key: string]: CardSystem;
};

const getCardSystemForEvent = async ({ headers, id }: CardSystems) => {
  const res = await fetchFromApi({
    path: `/uitpas/events/${id.toString()}/cardSystems/`,
    options: {
      headers,
    },
  });
  if (isErrorObject(res)) {
    // eslint-disable-next-line no-console
    return console.error(res);
  }
  return await res.json();
};

const useGetCardSystemForEventQuery = (
  { req, queryClient, id },
  configuration: UseQueryOptions = {},
) =>
  useAuthenticatedQuery({
    req,
    queryClient,
    queryKey: ['uitpas_events'],
    queryFn: getCardSystemForEvent,
    queryArguments: { id },
    enabled: !!id,
    ...configuration,
  });

const getCardSystemsForOrganizer = async ({ headers, id }: CardSystems) => {
  const res = await fetchFromApi({
    path: `/uitpas/organizers/${id.toString()}/cardSystems/`,
    options: {
      headers,
    },
  });
  if (isErrorObject(res)) {
    // eslint-disable-next-line no-console
    return console.error(res);
  }
  return await res.json();
};

const useGetCardSystemsForOrganizerQuery = (
  { req, queryClient, id },
  configuration: UseQueryOptions = {},
) =>
  useAuthenticatedQuery({
    req,
    queryClient,
    queryKey: ['uitpas_organizers'],
    queryFn: getCardSystemsForOrganizer,
    queryArguments: { id },
    enabled: !!id,
    ...configuration,
  });

export { useGetCardSystemForEventQuery, useGetCardSystemsForOrganizerQuery };
export type { CardSystem };
