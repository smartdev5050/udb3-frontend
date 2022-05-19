import { useQuery } from 'react-query';

import municipalities from '../../../public/assets/sapi3Cities.json';

const getMunicipalitiesByQuery = (ctx: any) => {
  const [_, query] = ctx.queryKey;

  const newMunicipalities = municipalities.filter((municipality) =>
    municipality.name.toLowerCase().includes(query.toLowerCase()),
  );

  return newMunicipalities;
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
