import levenshtein from 'fast-levenshtein';
import { QueryFunctionContext, useQuery } from 'react-query';

import { Countries, Country } from '@/types/Country';

import citiesBE from '../../../public/assets/citiesBE.json';
import citiesNL from '../../../public/assets/citiesNl.json';

type City = {
  label: string;
  name: string;
  zip: string;
};

type GetCitiesArguments = {
  q: string;
  country: Country;
};

const getCitiesBe = (): City[] =>
  citiesBE.cities
    .filter((city) => city.submunicipality)
    .map((city) => ({
      label: city.zip + ' ' + city.labelnl,
      name: city.labelnl,
      zip: city.zip,
    }));

const getCitiesNl = (): City[] => citiesNL.cities;

const matchesQuery = (query: string) => {
  return (city: City) => city.label.toLowerCase().includes(query);
};

const sortByLevenshtein = (query: string) => {
  return (a: City, b: City) => {
    const aLowercase = a.label.toLowerCase();
    const bLowercase = b.label.toLowerCase();

    const distanceA = levenshtein.get(query, aLowercase);
    const distanceB = levenshtein.get(query, bLowercase);

    return distanceA - distanceB;
  };
};

const getCitiesByQuery = (
  ctx: QueryFunctionContext<[string, GetCitiesArguments]>,
) => {
  const [_, { q, country }] = ctx.queryKey;

  const cities = country === Countries.NL ? getCitiesNl() : getCitiesBe();

  const query = q.toLowerCase();

  return cities.filter(matchesQuery(query)).sort(sortByLevenshtein(query));
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
