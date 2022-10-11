import fs from 'fs';
import path from 'path';

const json = fs.readFileSync(path.resolve('./citiesBE.json'), 'utf-8');
const data = JSON.parse(json);

const mappedCities = data.cities
  .filter((city) => typeof city.submunicipality === 'string')
  .map((city) => ({
    label: `${city.zip}  ${city.labelnl}`,
    name: city.labelnl,
    zip: city.zip,
  }));

fs.writeFileSync(
  path.resolve('./newCitiesBE.json'),
  JSON.stringify({ cities: mappedCities }),
  'utf-8',
);
