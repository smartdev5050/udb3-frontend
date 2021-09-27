import { fetchFromApi, isErrorObject } from '@/utils/fetchFromApi';

import { useAuthenticatedQuery } from './authenticated-query';

const getImageById = async ({ headers, id }) => {
  const res = await fetchFromApi({
    path: `/images/${id}`,
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

const useGetImageById = ({ id }, configuration = {}) =>
  useAuthenticatedQuery({
    queryKey: ['images'],
    queryFn: getImageById,
    queryArguments: {
      id,
    },
    enabled: !!id,
    ...configuration,
  });

export { useGetImageById };
