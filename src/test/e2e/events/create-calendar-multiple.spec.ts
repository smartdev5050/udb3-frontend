import { faker } from '@faker-js/faker';
import { test } from '@playwright/test';

const dummyEvent = {
  name: 'E2E test event with calendarType multiple',
  address: {
    zip: '1000',
    municipality: '1000 Brussel',
    place: 'Ancienne Belgique',
  },
};

test('create an event with calendarType multiple', async ({
  baseURL,
  page,
}) => {
  await page.goto(`${baseURL}/create`);
  // 1. Select event
  await page.getByRole('button', { name: 'Evenement' }).click();

  // 2. Type
  await page
    .getByRole('button', { name: 'Fiets- of wandelroute', exact: true })
    .click();

  // 3. Date
  // Add 3 dates in the future
  await page
    .locator('#calendar-step-day-day-1date-period-picker-start')
    .fill(faker.date.future().toLocaleDateString('nl-BE'));
  await page.getByRole('button', { name: 'Dag toevoegen' }).click();

  await page
    .locator('#calendar-step-day-day-2date-period-picker-start')
    .fill(faker.date.future().toLocaleDateString('nl-BE'));
  await page.getByRole('button', { name: 'Dag toevoegen' }).click();

  await page
    .locator('#calendar-step-day-day-3date-period-picker-start')
    .fill(faker.date.future().toLocaleDateString('nl-BE'));

  // 4. Address
  await page.getByLabel('Gemeente').click();
  await page.getByLabel('Gemeente').fill(dummyEvent.address.zip);
  await page
    .getByRole('option', { name: dummyEvent.address.municipality })
    .click();
  await page.getByLabel('Kies een locatie').click();

  await page
    .getByLabel('Kies een locatie')
    .fill(dummyEvent.address.place.substring(0, 3));

  await page
    .getByRole('option', { name: dummyEvent.address.place, exact: true })
    .first()
    .click();

  // 5. Name and Age
  await page.getByLabel('Naam van het evenement').click();
  await page.getByLabel('Naam van het evenement').fill(dummyEvent.name);
  await page.getByRole('button', { name: 'Jongeren' }).click();
  await page.getByRole('button', { name: 'Opslaan' }).click();

  // Publish
  await page.getByRole('button', { name: 'Publiceren', exact: true }).click();
});
