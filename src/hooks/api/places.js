import { fetchFromApi } from '../../utils/fetchFromApi';
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

const useGetPlaceById = ({ id }, configuration = {}) =>
  useAuthenticatedQuery({
    queryKey: ['places'],
    queryFn: getPlaceById,
    queryArguments: { id },
    enabled: !!id,
    ...configuration,
  });

const changeStatus = async ({ headers, id, type, reason }) => {
  const res = await fetchFromApi({
    path: `/places/${id.toString()}/status`,
    options: {
      method: 'PUT',
      headers,
      body: JSON.stringify({ type, reason }),
    },
  });
  return await res.json();
};

const useChangeStatus = (configuration = {}) =>
  useAuthenticatedMutation({ mutationFn: changeStatus, ...configuration });

export { useGetPlaceById, useChangeStatus };
