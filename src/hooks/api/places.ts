import type { UseMutationOptions, UseQueryOptions } from 'react-query';

import type { EventTypes } from '@/constants/EventTypes';
import type { OfferStatus } from '@/constants/OfferStatus';
import type { SupportedLanguages } from '@/i18n/index';
import type { Place } from '@/types/Place';
import type { User } from '@/types/User';
import type { Values } from '@/types/Values';
import { createEmbededCalendarSummaries } from '@/utils/createEmbededCalendarSummaries';
import { createSortingArgument } from '@/utils/createSortingArgument';
import { fetchFromApi, isErrorObject } from '@/utils/fetchFromApi';

import type {
  AuthenticatedQueryOptions,
  CalendarSummaryFormats,
  PaginationOptions,
  SortOptions,
} from './authenticated-query';
import {
  useAuthenticatedMutation,
  useAuthenticatedQuery,
} from './authenticated-query';
import type { Headers } from './types/Headers';

const getPlaceById = async ({ headers, id }) => {
  const res = await fetchFromApi({
    path: `/place/${id.toString()}`,
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

const useGetPlaceByIdQuery = (
  { req, queryClient, id },
  configuration: UseQueryOptions = {},
) =>
  useAuthenticatedQuery({
    req,
    queryClient,
    queryKey: ['places'],
    queryFn: getPlaceById,
    queryArguments: { id },
    enabled: !!id,
    ...configuration,
  });

const getPlacesByCreator = async ({ headers, ...queryData }) => {
  const res = await fetchFromApi({
    path: '/places/',
    searchParams: {
      ...queryData,
    },
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

const useGetPlacesByCreatorQuery = (
  {
    req,
    queryClient,
    creator,
    paginationOptions = { start: 0, limit: 50 },
    sortOptions = { field: 'modified', order: 'desc' },
    calendarSummaryFormats = ['lg-text', 'sm-text'],
  }: AuthenticatedQueryOptions<
    PaginationOptions &
      SortOptions &
      CalendarSummaryFormats & {
        creator: User;
      }
  >,
  configuration: UseQueryOptions = {},
) =>
  useAuthenticatedQuery<Place[]>({
    req,
    queryClient,
    queryKey: ['places'],
    queryFn: getPlacesByCreator,
    queryArguments: {
      q: `creator:(${creator.id} OR ${creator.email})`,
      disableDefaultFilters: true,
      embed: true,
      limit: paginationOptions.limit,
      start: paginationOptions.start,
      workflowStatus: 'DRAFT,READY_FOR_VALIDATION,APPROVED,REJECTED',
      ...createSortingArgument(sortOptions),
      ...createEmbededCalendarSummaries(calendarSummaryFormats),
    },
    enabled: !!(creator.id && creator.email),
    ...configuration,
  });

type GetPlacesByQueryArguments = {
  name: string;
  terms: Array<Values<typeof EventTypes>>;
};

const getPlacesByQuery = async ({
  headers,
  name,
  terms,
}: Headers & GetPlacesByQueryArguments) => {
  const nameString = name ? `name.\\*:*${name}*` : '';
  const termsString = terms.reduce(
    (acc, currentTerm) => `${acc}terms.id:${currentTerm}`,
    '',
  );
  const queryArguments = [nameString, termsString].filter(
    (argument) => !!argument,
  );

  const res = await fetchFromApi({
    path: '/places/',
    searchParams: {
      // eslint-disable-next-line no-useless-escape
      q: queryArguments.join(' AND '),
      embed: 'true',
    },
    options: {
      headers: (headers as unknown) as Record<string, string>,
    },
  });

  if (isErrorObject(res)) {
    // eslint-disable-next-line no-console
    return console.error(res);
  }
  return await res.json();
};

const useGetPlacesByQuery = (
  { name, terms }: GetPlacesByQueryArguments,
  configuration = {},
) =>
  useAuthenticatedQuery<Place[]>({
    queryKey: ['places'],
    queryFn: getPlacesByQuery,
    queryArguments: {
      name,
      terms,
    },
    enabled: !!name || terms.length,
    ...configuration,
  });

const deletePlaceById = async ({ headers, id }) =>
  fetchFromApi({
    path: `/places/${id}`,
    options: { headers, method: 'DELETE' },
  });

const useDeletePlaceByIdMutation = (configuration = {}) =>
  useAuthenticatedMutation({
    mutationFn: deletePlaceById,
    ...configuration,
  });

type ChangeStatusArguments = {
  headers: Headers;
  id: string;
  type: Values<typeof OfferStatus>;
  reason: Record<Values<typeof SupportedLanguages>, string>;
};

const changeStatus = async ({
  headers,
  id,
  type,
  reason,
}: ChangeStatusArguments) =>
  fetchFromApi({
    path: `/places/${id.toString()}/status`,
    options: {
      method: 'PUT',
      headers,
      body: JSON.stringify({ type, reason }),
    },
  });

const useChangeStatusMutation = (configuration: UseMutationOptions = {}) =>
  useAuthenticatedMutation({ mutationFn: changeStatus, ...configuration });

export {
  useChangeStatusMutation,
  useDeletePlaceByIdMutation,
  useGetPlaceByIdQuery,
  useGetPlacesByCreatorQuery,
  useGetPlacesByQuery,
};
