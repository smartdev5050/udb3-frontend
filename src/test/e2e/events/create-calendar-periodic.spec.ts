import { faker } from '@faker-js/faker';
import { test } from '@playwright/test';

const dummyEvent = {
  name: 'E2E test event with calendarType permanent and openinghours',
  address: {
    zip: '8500',
    municipality: '8500 Kortrijk',
    place: 'Kreun',
  },
};

const startDate = faker.date.future();
const endDate = faker.date.future({ refDate: startDate });

test('create an event with calendarType permanent and openinghours', async ({
  baseURL,
  page,
}) => {
  await page.goto(`${baseURL}/create`);
  // 1. Select event
  await page.getByRole('button', { name: 'Evenement' }).click();

  // 2. Type
  await page.getByRole('button', { name: 'Beurs', exact: true }).click();

  // 3. Date
  // Select fixed days
  await page.getByRole('button', { name: 'Vaste dagen per week' }).click();

  await page
    .locator('#calendar-step-fixeddate-period-picker-start')
    .fill(startDate.toLocaleDateString('nl-BE'));

  await page
    .locator('#calendar-step-fixeddate-period-picker-end')
    .fill(endDate.toLocaleDateString('nl-BE'));

  await page.getByRole('button', { name: 'Openingsuren toevoegen' }).click();
  // // openinghours
  await page.getByText('Ma', { exact: true }).click();
  await page.getByText('Wo', { exact: true }).click();
  await page.getByText('Vr', { exact: true }).click();
  await page.getByRole('button', { name: 'Opslaan' }).click();

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
    .getByRole('option', { name: dummyEvent.address.place })
    .first()
    .click();

  // 5. Name and Age
  await page.getByLabel('Naam van het evenement').click();
  await page.getByLabel('Naam van het evenement').fill(dummyEvent.name);
  await page.getByRole('button', { name: 'Alle leeftijden' }).click();
  await page.getByRole('button', { name: 'Opslaan' }).click();

  // Publish
  await page.getByRole('button', { name: 'Publiceren', exact: true }).click();
});
