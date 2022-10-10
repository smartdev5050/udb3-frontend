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
  [Countries.NL]: 'GEO-NL-5-STD.json',
};

const getCities: NextApiHandler = async (req, res) => {
  const { country: countryArr, q: qAsArr } = req.query;

  const country = arrayToValue(countryArr);
  const q = arrayToValue(qAsArr);

  const fileName = countryToFileName[country];

  if (!fileName) {
    res.status(400).send('');
    return;
  }

  const json = await fs.readFile(
    path.resolve(`./public/assets/`, fileName),
    'utf-8',
  );

  if (country === Countries.BE) {
    const result = getCitiesBe(JSON.parse(json));
    res.send(result.slice(0, 10));
    return;
  }

  if (country === Countries.NL) {
    const result = getCitiesNl(JSON.parse(json));
    res.send(result.slice(0, 10));
    return;
  }

  const { features }: { features: Feature[] } = JSON.parse(json);

  const countries = features.map((feature) => {
    const city = feature.properties;
    const municipality = `${city.Region2}`;
    const label = `${city.PostalCode} ${municipality}`;
    const name = `${municipality}`;
    const zip = city.PostalCode;

    return {
      label,
      name,
      zip,
    };
  });

  const query = q.toLowerCase();

  res.setHeader('Content-Type', 'application/json');

  if (!query) {
    const result = countries.sort(sortByLevenshtein(query));
    res.send(result.slice(0, 100));
    return;
  }

  const result = countries
    .filter(matchesQuery(query))
    .sort(sortByLevenshtein(query));

  res.send(result.slice(0, 2));
};

export default getCities;
