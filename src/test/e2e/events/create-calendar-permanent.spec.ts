import { test } from '@playwright/test';

const dummyEvent = {
  name: 'E2E test event with calendarType permanent',
  address: {
    zip: '2000',
    municipality: '2000 Antwerpen',
    place: 'FOMU - Fotomuseum Antwerpen',
  },
};

test('create an event with calendarType permanent', async ({
  baseURL,
  page,
}) => {
  await page.goto(`${baseURL}/create`);
  // 1. Select event
  await page.getByRole('button', { name: 'Evenement' }).click();

  // 2. Type
  await page
    .getByRole('button', { name: 'Tentoonstelling', exact: true })
    .click();

  // 3. Date
  // Select fixed days
  await page.getByRole('button', { name: 'Vaste dagen per week' }).click();

  await page.getByRole('radio', { name: 'Permanent' }).click();

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
  await page.getByRole('button', { name: 'Alle leeftijden' }).click();
  await page.getByRole('button', { name: 'Opslaan' }).click();

  // Publish
  await page.getByRole('button', { name: 'Publiceren', exact: true }).click();
});
