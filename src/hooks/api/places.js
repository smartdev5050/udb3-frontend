import { fetchFromApi } from '../../utils/fetchFromApi';
import { useAuthenticatedQuery } from './authenticated-query';

const getPlaceById = async ({ headers, id }) => {
  const res = await fetchFromApi({
    path: `/place/${id.toString()}`,
    options: {
      headers,
    },
  });
  return await res.json();
};

const useGetPlaceById = ({ id }, configuration) =>
  useAuthenticatedQuery({
    queryKey: ['places'],
    queryFn: getPlaceById,
    queryArguments: { id },
    enabled: !!id,
    ...configuration,
  });

export { useGetPlaceById };
