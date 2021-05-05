import type { NextApiRequest } from 'next';
import type { QueryClient, UseQueryOptions } from 'react-query';

import { useAuthenticatedQuery } from '@/hooks/api/authenticated-query';
import { fetchFromApi, isErrorObject } from '@/utils/fetchFromApi';

type ServerSideArguments = {
  req?: NextApiRequest;
  queryClient?: QueryClient;
};

type Headers = Record<string, string>;

type HeadersAndQueryData = {
  headers: Headers;
} & { [x: string]: string };

type GetOrganizerByIdArguments = {
  headers: Headers;
  id: string;
};

type SortOptions = {
  field: string;
  order: string;
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
  creatorId: string;
  start: number;
  limit: number;
  sortOptions: SortOptions;
};

const useGetOrganizersByCreator = (
  {
    creatorId,
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
      creator: creatorId,
      limit,
      start,
      embed: true,
      [`sort[${sortOptions.field}}]`]: `${sortOptions.order}`,
    },
    ...configuration,
  });

export { useGetOrganizerById, useGetOrganizersByCreator };
