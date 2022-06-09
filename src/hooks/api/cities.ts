import levenshtein from 'fast-levenshtein';
import { QueryFunctionContext, useQuery } from 'react-query';

import citiesBE from '../../../public/assets/citiesBE.json';
import citiesNL from '../../../public/assets/citiesNl.json';

type City = {
  label: string;
  name: string;
  zip: string;
};

const byLevenshtein = (query: string) => {
  return (a: City, b: City) => {
    const aLowercase = a.label.toLowerCase();
    const bLowercase = b.label.toLowerCase();

    const distanceA = levenshtein.get(query, aLowercase);
    const distanceB = levenshtein.get(query, bLowercase);

    return distanceA - distanceB;
  };
};

type GetCitiesArguments = {
  q: string;
  country: 'BE' | 'NL';
};

const getCitiesBe = (): City[] =>
  citiesBE.cities
    .filter((city) => city.submunicipality)
    .map((city) => {
      return {
        label: city.zip + ' ' + city.labelnl,
        name: city.labelnl,
        zip: city.zip,
      };
    });

const getCitiesNl = (): City[] => citiesNL.cities;

const getCitiesByQuery = (
  ctx: QueryFunctionContext<[string, GetCitiesArguments]>,
) => {
  const [_, { q: query, country }] = ctx.queryKey;

  const cities = country === 'NL' ? getCitiesNl() : getCitiesBe();

  const queryLowercase = query.toLowerCase();

  const matchesQuery = (city: City): boolean => {
    return city.label.toLowerCase().includes(queryLowercase);
  };

  return cities.filter(matchesQuery).sort(byLevenshtein(queryLowercase));
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
