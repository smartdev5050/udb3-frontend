/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';

const regionToAmountUsedMap = new Map();

/**
 * Convert the Mapanet format to the Uitdatabank format
 */
const toUitdatabankFormat = (feature) => {
  const { Region2: region2, Locality: locality } = feature.properties;

  if (regionToAmountUsedMap.has(region2)) {
    const currentValue = regionToAmountUsedMap.get(region2);
    regionToAmountUsedMap.set(currentValue + 1);
  } else {
    regionToAmountUsedMap.set(1);
  }

  const label = region2 ? `${locality} (${region2})` : `${locality}`;

  return {
    label: label,
    name: label,
    zip: '',
  };
};

/**
 * Remove region from name if it is only used once
 */
const removeRegionIfOnlyUsedOnce = (city) => {
  if (!city.name.includes('(')) {
    return city;
  }

  const [locality, lastPart] = city.name.split(' (');
  const region = lastPart.substring(0, lastPart.length - 1);

  if (regionToAmountUsedMap.get(region) > 1) {
    return city;
  }

  // Use locality as the name if this region is only used once
  return {
    ...city,
    label: locality,
    name: locality,
  };
};

const convertMapanetToUdb = async () => {
  // Get argument from cli into variables
  const MAPANET_FILE_NAME = process.argv[2];
  const GENERATED_FILE_NAME = process.argv[3];

  if (!MAPANET_FILE_NAME || !GENERATED_FILE_NAME) {
    console.error('🚨 Please specify the correct arguments:');
    console.error('- Input filename as first argument');
    console.error('- Output filename as second argument');

    process.exit(1);
  }

  console.info('⌛️ Starting conversion');
  console.info('--------------------------------------');

  const newFilePath = path.resolve('./', GENERATED_FILE_NAME);

  const doesGeneratedFileExist = fs.existsSync(newFilePath);

  if (doesGeneratedFileExist) {
    await fs.promises.rm(newFilePath);
    console.info(`🗑 ${GENERATED_FILE_NAME} removed`);
  }

  console.info(`📖 Reading ${MAPANET_FILE_NAME}`);

  const mapanetFilePath = path.resolve('./', MAPANET_FILE_NAME);
  const mapanetFileExists = fs.existsSync(mapanetFilePath);

  if (!mapanetFileExists) {
    console.error(`🚨 ${MAPANET_FILE_NAME} not found`);

    process.exit(1);
  }

  const mapanetJson = await fs.promises.readFile(mapanetFilePath, 'utf-8');
  const mapanetData = JSON.parse(mapanetJson);

  const { features } = mapanetData;

  const cities = features
    .map(toUitdatabankFormat)
    .map(removeRegionIfOnlyUsedOnce);

  await fs.promises.writeFile(newFilePath, JSON.stringify(cities), 'utf-8');

  console.info('--------------------------------------');
  console.info('✅ Done converting');
};

convertMapanetToUdb();
