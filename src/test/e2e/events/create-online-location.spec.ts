import { faker } from '@faker-js/faker';
import { test } from '@playwright/test';

const dummyEvent = {
  name: 'E2E test event with online location',
  locationUrl: faker.internet.url(),
};

test('create an event with online location', async ({ baseURL, page }) => {
  await page.goto(`${baseURL}/create`);
  // 1. Select event
  await page.getByRole('button', { name: 'Evenement' }).click();
  // 2. Type
  await page.getByRole('button', { name: 'Concert' }).click();
  // 3. Date
  // Use current date

  // 4. Address (select online location)
  await page.getByRole('button', { name: 'Online' }).click();

  await page.getByLabel('Deelnamelink').fill(dummyEvent.locationUrl);

  // 5. Name and Age
  await page.getByLabel('Naam van het evenement').click();
  await page.getByLabel('Naam van het evenement').fill(dummyEvent.name);
  await page.getByRole('button', { name: 'Volwassenen 18+' }).click();

  await page.getByRole('button', { name: 'Opslaan' }).click();

  // Publish
  await page.getByRole('button', { name: 'Publiceren', exact: true }).click();
});
