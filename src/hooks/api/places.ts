import type { UseMutationOptions, UseQueryOptions } from 'react-query';

import type { OfferStatus } from '@/constants/OfferStatus';
import type { SupportedLanguage } from '@/i18n/index';
import type { User } from '@/types/User';
import type { Values } from '@/types/Values';
import { createSortingArgument } from '@/utils/createSortingArgument';
import { fetchFromApi, isErrorObject } from '@/utils/fetchFromApi';

import type {
  AuthenticatedQueryOptions,
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

const useGetPlaceById = (
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

const useGetPlacesByCreator = (
  {
    req,
    queryClient,
    creator,
    paginationOptions = { start: 0, limit: 50 },
    sortOptions = { field: 'modified', order: 'desc' },
  }: AuthenticatedQueryOptions<
    PaginationOptions &
      SortOptions & {
        creator: User;
      }
  >,
  configuration: UseQueryOptions = {},
) =>
  useAuthenticatedQuery({
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
    },
    enabled: !!(creator.id && creator.email),
    ...configuration,
  });

type ChangeStatusArguments = {
  headers: Headers;
  id: string;
  type: Values<typeof OfferStatus>;
  reason: { [key in SupportedLanguage]: string };
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

const useChangeStatus = (configuration: UseMutationOptions = {}) =>
  useAuthenticatedMutation({ mutationFn: changeStatus, ...configuration });

export { useChangeStatus, useGetPlaceById, useGetPlacesByCreator };
