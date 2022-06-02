import { QueryFunctionContext, useQuery } from 'react-query';

import municipalities from '../../../public/assets/sapi3Cities.json';

const getMunicipalitiesByQuery = (
  ctx: QueryFunctionContext<[string, string]>,
) => {
  const [_, query] = ctx.queryKey;

  const matchesQuery = (municipality: { name: string; key: string }): boolean =>
    municipality.name.toLowerCase().includes(query.toLowerCase());

  return municipalities.filter(matchesQuery);
};

const useGetMunicipalitiesByQuery = (
  {
    q,
  }: {
    q: string;
  },
  options = {},
) =>
  useQuery({
    queryKey: ['municipalities', q],
    queryFn: getMunicipalitiesByQuery,
    enabled: !!q,
    ...options,
  });

export { useGetMunicipalitiesByQuery };
