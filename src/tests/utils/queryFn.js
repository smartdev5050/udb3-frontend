import { fetchFromApi } from '../../utils/fetchFromApi';

const queryFn = async ({ headers, ...queryData }) => {
  const res = await fetchFromApi({
    path: '/random',
    options: {
      headers,
    },
  });
  return await res.json();
};

export { queryFn };
