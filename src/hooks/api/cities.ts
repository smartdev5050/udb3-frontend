import { QueryFunctionContext, useQuery } from 'react-query';

import { Country } from '@/types/Country';

type City = {
  label: string;
  name: string;
  zip: string;
};

type GetCitiesArguments = {
  q: string;
  country: Country;
};

const getCitiesByQuery = async (
  ctx: QueryFunctionContext<[string, GetCitiesArguments]>,
) => {
  const [_, { q, country }] = ctx.queryKey;

  const params = new URLSearchParams({ q, country });

  const res = await fetch(`/api/cities?${params.toString()}`);

  if (!res.ok) {
    return;
  }

  const data = await res.json();

  return data;
};

const useGetCitiesByQuery = (
  { q, country }: GetCitiesArguments,
  options = {},
) =>
  useQuery({
    queryKey: ['cities', { q, country }],
    queryFn: getCitiesByQuery,
    enabled: !!q,
    ...options,
  });

export { useGetCitiesByQuery };
export type { City };
