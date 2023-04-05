import { fetchFromApi, isErrorObject } from '@/utils/fetchFromApi';
import { useAuthenticatedQuery } from '@/hooks/api/authenticated-query';
import { Place } from '@/types/Place';

const getLabelsByQuery = async ({ headers, query }) => {
  const res = await fetchFromApi({
    path: '/labels/',
    searchParams: {
      q: query,
      limit: '6',
      start: '0',
      suggestion: 'true',
    },
    options: {
      headers: headers as unknown as Record<string, string>,
    },
  });

  if (isErrorObject(res)) {
    // eslint-disable-next-line no-console
    return console.error(res);
  }

  return await res.json();
};

const useGetLabelsByQuery = ({ query }: { query: string }) =>
  useAuthenticatedQuery<string[]>({
    queryKey: ['labels'],
    queryFn: getLabelsByQuery,
    queryArguments: {
      query,
    },
    enabled: !!query,
  });

export { getLabelsByQuery, useGetLabelsByQuery };
