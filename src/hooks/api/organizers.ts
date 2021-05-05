import type { UseQueryOptions } from 'react-query';

import { useAuthenticatedQuery } from '@/hooks/api/authenticated-query';
import { fetchFromApi, isErrorObject } from '@/utils/fetchFromApi';

import type { Headers } from './types/Headers';
import type { ServerSideArguments } from './types/ServerSideArguments';
import type { SortOptions } from './types/SortOptions';

type HeadersAndQueryData = {
  headers: Headers;
} & { [x: string]: string };

type GetOrganizerByIdArguments = {
  headers: Headers;
  id: string;
};
const getOrganizerById = async ({ headers, id }: GetOrganizerByIdArguments) => {
  const res = await fetchFromApi({
    path: `/organizers/${id.toString()}`,
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

type UseGetOrganizerByIdArguments = ServerSideArguments & { id: string };

const useGetOrganizerById = (
  { req, queryClient, id }: UseGetOrganizerByIdArguments,
  configuration: UseQueryOptions = {},
) =>
  useAuthenticatedQuery({
    req,
    queryClient,
    queryKey: ['organizers'],
    queryFn: getOrganizerById,
    queryArguments: { id },
    enabled: !!id,
    ...configuration,
  });

type GetOrganizersByCreator = HeadersAndQueryData;

const getOrganizersByCreator = async ({
  headers,
  ...queryData
}: GetOrganizersByCreator) => {
  const res = await fetchFromApi({
    path: '/organizers/',
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

type UseGetOrganizersByCreator = {
  creator: { id: string; email: string };
  start?: number;
  limit?: number;
  sortOptions?: SortOptions;
};

const useGetOrganizersByCreator = (
  {
    creator,
    limit = 50,
    start = 0,
    sortOptions = { field: 'modified', order: 'desc' },
  }: UseGetOrganizersByCreator,
  configuration: UseQueryOptions = {},
) =>
  useAuthenticatedQuery({
    queryKey: ['organizers'],
    queryFn: getOrganizersByCreator,
    queryArguments: {
      q: `creator:(${creator.id} OR ${creator.email})`,
      limit,
      start,
      embed: true,
      [`sort[${sortOptions.field}}]`]: `${sortOptions.order}`,
    },
    configuration: {
      enabled: !!(creator.id && creator.email),
      ...configuration,
    },
  });

export { useGetOrganizerById, useGetOrganizersByCreator };
