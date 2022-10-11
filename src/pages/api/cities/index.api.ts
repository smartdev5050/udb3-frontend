import { distance } from 'fastest-levenshtein';
import fs from 'fs/promises';
import { NextApiHandler } from 'next';
import path from 'path';

import { City } from '@/pages/CityPicker';
import { Countries } from '@/types/Country';
import { arrayToValue } from '@/utils/arrayToValue';

export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface Properties {
  Elevation: string;
  ISO: string;
  Country: string;
  Language: string;
  ID: string;
  PostalCode: string;
  Region1: string;
  Region2: string;
  Region3: string;
  Region4: string;
  Locality: string;
  Suburb: string;
  TimeZone: string;
  UTC: string;
  DST: string;
}

export interface Feature {
  type: string;
  geometry: Geometry;
  properties: Properties;
}

const sortByLevenshtein = (query: string) => {
  return (a: City, b: City) => {
    const aLowercase = a.label.toLowerCase();
    const bLowercase = b.label.toLowerCase();

    const distanceA = distance(query, aLowercase);
    const distanceB = distance(query, bLowercase);

    return distanceA - distanceB;
  };
};

const matchesQuery = (query: string) => {
  return (city: City) => city.label.toLowerCase().includes(query);
};

const getCitiesBe = (data: any): City[] =>
  data.cities
    .filter((city) => typeof city.submunicipality === 'string')
    .map((city) => ({
      label: city.zip + ' ' + city.labelnl,
      name: city.labelnl,
      zip: city.zip,
    }));

const getCitiesNl = (data: any): City[] => {
  return data.cities;
};

const countryToFileName = {
  [Countries.BE]: 'citiesBE.json',
  [Countries.NL]: 'citiesNL.json',
};

const parseCitiesForCountry = {
  [Countries.BE]: getCitiesBe,
  [Countries.NL]: getCitiesNl,
};

const getCities: NextApiHandler = async (req, res) => {
  const { country: countryArr, q: qArr } = req.query;

  const country = arrayToValue(countryArr);
  const q = arrayToValue(qArr);

  const fileName = countryToFileName[country];

  if (!fileName) {
    res.status(400).send('');
    return;
  }

  const json = await fs.readFile(
    path.resolve(`./public/assets/`, fileName),
    'utf-8',
  );
  const data = JSON.parse(json);

  const cities = parseCitiesForCountry[country]?.(data);

  if (!cities) {
    res.status(400).send('');
    return;
  }

  const query = q.toLowerCase();

  if (!query) {
    const result = cities;
    res.json(result);
    return;
  }

  const result = cities
    .filter(matchesQuery(query))
    .sort(sortByLevenshtein(query));

  res.json(result);
};

export default getCities;
