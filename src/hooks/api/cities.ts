import { useQuery } from 'react-query';

import cities from '../../../public/assets/sapi3Cities.json';

const getCitiesByQuery = (ctx: any) => {
  const [_, query] = ctx.queryKey;

  const newCities = cities.filter((city) =>
    city.name.toLowerCase().includes(query.toLowerCase()),
  );

  return newCities;
};

const useGetCitiesByQuery = (
  {
    q,
  }: {
    q: string;
  },
  options = {},
) =>
  useQuery({
    queryKey: ['cities', q],
    queryFn: getCitiesByQuery,
    enabled: !!q,
    ...options,
  });

export { useGetCitiesByQuery };
