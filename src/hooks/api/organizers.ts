import type { UseMutationOptions, UseQueryOptions } from 'react-query';

import type {
  AuthenticatedQueryOptions,
  PaginationOptions,
  SortOptions,
} from '@/hooks/api/authenticated-query';
import {
  useAuthenticatedMutation,
  useAuthenticatedQuery,
} from '@/hooks/api/authenticated-query';
import type { Organizer } from '@/types/Organizer';
import type { User } from '@/types/User';
import { createSortingArgument } from '@/utils/createSortingArgument';
import { fetchFromApi, isErrorObject } from '@/utils/fetchFromApi';

import type { Headers } from './types/Headers';

type HeadersAndQueryData = {
  headers: Headers;
} & { [x: string]: string };

type GetOrganizersArguments = {
  headers: Headers;
  embed: string;
  q: string;
};

const getOrganizers = async ({ headers, q, embed }: GetOrganizersArguments) => {
  const res = await fetchFromApi({
    path: '/organizers',
    searchParams: {
      embed: `${embed}`,
      q,
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

const useGetOrganizersQuery = (
  { req, queryClient, q }: AuthenticatedQueryOptions<{ q?: string }> = {},
  configuration: UseQueryOptions = {},
) =>
  useAuthenticatedQuery<{ member: Organizer[] }>({
    req,
    queryClient,
    queryKey: ['organizers'],
    queryFn: getOrganizers,
    queryArguments: {
      embed: true,
      q,
    },
    ...configuration,
  });

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

const useGetOrganizerByIdQuery = (
  { req, queryClient, id },
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

const deleteOrganizerById = async ({ headers, id }) =>
  fetchFromApi({
    path: `/organizers/${id}`,
    options: { headers, method: 'DELETE' },
  });

const useDeleteOrganizerByIdMutation = (configuration = {}) =>
  useAuthenticatedMutation({
    mutationFn: deleteOrganizerById,
    ...configuration,
  });

const useGetOrganizersByCreatorQuery = (
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
  useAuthenticatedQuery<Organizer[]>({
    req,
    queryClient,
    queryKey: ['organizers'],
    queryFn: getOrganizersByCreator,
    queryArguments: {
      q: `creator:(${creator.id} OR ${creator.email})`,
      limit: paginationOptions.limit,
      start: paginationOptions.start,
      embed: true,
      ...createSortingArgument(sortOptions),
    },
    enabled: !!(creator.id && creator.email),
    ...configuration,
  });

const createOrganizer = ({ headers, url, name, mainLanguage }) =>
  fetchFromApi({
    path: '/organizers',
    options: {
      headers,
      method: 'POST',
      body: JSON.stringify({
        mainLanguage,
        name,
        url,
      }),
    },
  });

const useCreateOrganizerMutation = (configuration: UseMutationOptions = {}) =>
  useAuthenticatedMutation({
    mutationFn: createOrganizer,
    ...configuration,
  });

export {
  useCreateOrganizerMutation,
  useDeleteOrganizerByIdMutation,
  useGetOrganizerByIdQuery,
  useGetOrganizersByCreatorQuery,
  useGetOrganizersQuery,
};
