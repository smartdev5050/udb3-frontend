/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';

const localityToTimesUsed = new Map();

/**
 * Convert the Mapanet format to the Uitdatabank format
 */
const toUitdatabankFormat = (feature) => {
  const { Region2: region, Locality: locality } = feature.properties;

  if (localityToTimesUsed.has(locality)) {
    const currentValue = localityToTimesUsed.get(locality);
    localityToTimesUsed.set(locality, currentValue + 1);
  } else {
    localityToTimesUsed.set(locality, 1);
  }

  const label = region ? `${locality} (${region})` : `${locality}`;

  return {
    label,
    name: label,
    zip: '',
  };
};

const seenCityNames = new Set();

const filterOutDuplicates = (city) => {
  if (seenCityNames.has(city.name)) {
    const [locality] = city.name.split(' (');
    const currentValue = localityToTimesUsed.get(locality);
    localityToTimesUsed.set(locality, Math.max(currentValue - 1), 1);
    return false;
  }
  seenCityNames.add(city.name);
  return true;
};

/**
 * Remove region from name and label if it is only used once
 */
const removeRegionIfLocalityOnlyUsedOnce = (city) => {
  if (!city.name.includes('(')) {
    return city;
  }

  const [locality, lastPart] = city.name.split(' (');
  const region = lastPart.substring(0, lastPart.length - 1);

  if (localityToTimesUsed.get(locality) > 1) {
    return city;
  }

  return {
    ...city,
    label: locality,
    name: locality,
  };
};

const convertMapanetToUdb = () => {
  // Get argument from cli into variables
  const MAPANET_FILE_NAME = process.argv[2];
  const GENERATED_FILE_NAME = process.argv[3];

  if (!MAPANET_FILE_NAME || !GENERATED_FILE_NAME) {
    console.error('🚨 Please specify the correct arguments:');
    console.error('\t- Input filename as first argument');
    console.error('\t- Output filename as second argument');

    process.exit(1);
  }

  console.info('⌛️ Starting conversion');
  console.info('--------------------------------------');

  const newFilePath = path.resolve('./', GENERATED_FILE_NAME);

  const generatedFileExists = fs.existsSync(newFilePath);

  if (generatedFileExists) {
    fs.rmSync(newFilePath);
    console.info(`🗑 ${GENERATED_FILE_NAME} removed`);
  }

  console.info(`📖 Reading ${MAPANET_FILE_NAME}`);

  const mapanetFilePath = path.resolve('./', MAPANET_FILE_NAME);
  const mapanetFileExists = fs.existsSync(mapanetFilePath);

  if (!mapanetFileExists) {
    console.error(`🚨 ${MAPANET_FILE_NAME} not found`);

    process.exit(1);
  }

  const mapanetJson = fs.readFileSync(mapanetFilePath, 'utf-8');
  const mapanetData = JSON.parse(mapanetJson);

  const { features } = mapanetData;

  const cities = features
    .map(toUitdatabankFormat)
    .filter(filterOutDuplicates)
    .map(removeRegionIfLocalityOnlyUsedOnce);

  fs.writeFileSync(newFilePath, JSON.stringify({ cities }), 'utf-8');

  console.info('--------------------------------------');
  console.info('✅ Done converting');
};

convertMapanetToUdb();
