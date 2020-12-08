import { useAuthenticatedQuery } from './useAuthenticatedQuery';

const getProductions = async (key, { headers, ...queryData }) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/productions/`);
  url.search = new URLSearchParams({
    ...queryData,
  }).toString();
  const res = await fetch(url, {
    headers,
  });
  return await res.json();
};

const useGetProductions = ({ name = '', start = 0, limit = 15 }, config = {}) =>
  useAuthenticatedQuery(
    [
      'productions',
      {
        name,
        start,
        limit,
      },
    ],
    getProductions,
    config,
  );

export { useGetProductions };
