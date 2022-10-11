import { distance } from 'fastest-levenshtein';
import fs from 'fs/promises';
import { NextApiHandler } from 'next';
import path from 'path';

import { City } from '@/pages/CityPicker';
import { Countries } from '@/types/Country';
import { arrayToValue } from '@/utils/arrayToValue';

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

const countryToFileName = {
  [Countries.BE]: 'citiesBE.json',
  [Countries.NL]: 'citiesNL.json',
  [Countries.DE]: 'citiesDE.json',
};

const getCities: NextApiHandler = async (req, res) => {
  try {
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

    const cities = data?.cities;

    if (!cities) {
      res.status(400).send('');
      return;
    }

    const query = q.toLowerCase();

    if (!query) {
      res.json(cities);
      return;
    }

    const result = cities
      .filter(matchesQuery(query))
      .sort(sortByLevenshtein(query));

    res.json(result);
  } catch (error) {
    res.status(500).send('Internal Server Error');
    // eslint-disable-next-line no-console
    console.error('Internal Server Error', error);
  }
};

export default getCities;
