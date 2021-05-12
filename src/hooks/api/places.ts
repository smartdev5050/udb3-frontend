import type { UseMutationOptions, UseQueryOptions } from 'react-query';

import type { OfferStatus } from '@/constants/OfferStatus';
import type { Values } from '@/types/Values';
import { createSortingArgument } from '@/utils/createSortingArgument';
import { fetchFromApi, isErrorObject } from '@/utils/fetchFromApi';

import {
  useAuthenticatedMutation,
  useAuthenticatedQuery,
} from './authenticated-query';
import type { Headers } from './types/Headers';
import type { PaginationOptions } from './types/PaginationOptions';
import type { ServerSideArguments } from './types/ServerSideArguments';
import type { SortOptions } from './types/SortOptions';

type HeadersAndQueryData = {
  headers: Headers;
} & { [x: string]: string };

type GetPlaceByIdArguments = {
  headers: Headers;
  id: string;
};

const getPlaceById = async ({ headers, id }: GetPlaceByIdArguments) => {
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

type UseGetPlaceByIdArguments = ServerSideArguments & { id: string };

const useGetPlaceById = (
  { req, queryClient, id }: UseGetPlaceByIdArguments,
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

type GetPlacesByCreatorArguments = HeadersAndQueryData;

const getPlacesByCreator = async ({
  headers,
  ...queryData
}: GetPlacesByCreatorArguments) => {
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

type UseGetPlacesByCreatorArguments = ServerSideArguments & {
  creator: { id: string; email: string };
  paginationOptions?: PaginationOptions;
  sortOptions?: SortOptions;
};

const useGetPlacesByCreator = (
  {
    req,
    queryClient,
    creator,
    paginationOptions = { start: 0, limit: 50 },
    sortOptions = { field: 'modified', order: 'desc' },
  }: UseGetPlacesByCreatorArguments,
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
    configuration: {
      enabled: !!(creator.id && creator.email),
      ...configuration,
    },
  });

type ChangeStatusArguments = {
  headers: Headers;
  id: string;
  type: Values<typeof OfferStatus>;
  reason: { [language: string]: string };
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
