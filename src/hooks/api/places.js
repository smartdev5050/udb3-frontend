import { fetchFromApi } from '@/utils/fetchFromApi';

import {
  useAuthenticatedMutation,
  useAuthenticatedQuery,
} from './authenticated-query';

const getPlaceById = async ({ headers, id }) => {
  const res = await fetchFromApi({
    path: `/place/${id.toString()}`,
    options: {
      headers,
    },
  });
  return await res.json();
};

const useGetPlaceById = ({ req, queryClient, id }, configuration = {}) =>
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
  return await res.json();
};

const useGetPlacesByCreator = (
  {
    creatorId,
    start = 0,
    limit = 50,
    sort = { field: 'modified', order: 'desc' },
  },
  configuration = {},
) =>
  useAuthenticatedQuery({
    queryKey: ['places'],
    queryFn: getPlacesByCreator,
    queryArguments: {
      creator: creatorId,
      disableDefaultFilters: true,
      embed: true,
      limit,
      start,
      workflowStatus: 'DRAFT,READY_FOR_VALIDATION,APPROVED,REJECTED',
      [`sort[${sort.field}}]`]: `${sort.order}`,
    },
    configuration: {
      enabled: !!creatorId,
      ...configuration,
    },
  });

const changeStatus = async ({ headers, id, type, reason }) =>
  fetchFromApi({
    path: `/places/${id.toString()}/status`,
    options: {
      method: 'PUT',
      headers,
      body: JSON.stringify({ type, reason }),
    },
  });

const useChangeStatus = (configuration = {}) =>
  useAuthenticatedMutation({ mutationFn: changeStatus, ...configuration });

export { useChangeStatus, useGetPlaceById, useGetPlacesByCreator };
