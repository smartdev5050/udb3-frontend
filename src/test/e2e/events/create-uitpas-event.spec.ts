import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

const dummyEvent = {
  name: 'E2E test event with UiTPAS organizer and UiTPAS prices',
  address: {
    zip: '9000',
    municipality: '9000 Gent',
    place: 'S.M.A.K. - Stedelijk Museum voor Actuele Kunst',
  },
  organizer: {
    name: 'Democrazy',
  },
};

test('create an event with UiTPAS organizer and UiTPAS prices', async ({
  baseURL,
  page,
}) => {
  await page.goto(`${baseURL}/create`);
  // 1. Select event
  await page.getByRole('button', { name: 'Evenement' }).click();
  // 2. Type
  await page.getByRole('button', { name: 'Concert' }).click();
  // 3. Date
  // Use current date

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
  await page.getByRole('button', { name: 'Volwassenen 18+' }).click();

  await page.getByRole('button', { name: 'Opslaan' }).click();

  // 6. Additionnal Information
  await page.getByRole('tab', { name: 'Organisatie' }).click();
  await page.getByRole('button', { name: 'Organisatie toevoegen' }).click();
  await page.locator('#organizer-picker').fill(dummyEvent.organizer.name);

  await page
    .locator('.badge-secondary')
    .getByText('UiTPAS', { exact: true })
    .first()
    .click();

  // check if alert to add prices is visible
  await expect(
    page.locator('.alert-warning').getByText('Dit is een UiTPAS organisator'),
  ).toBeVisible();

  // check if price tab has an warning icon
  await expect(
    page
      .getByRole('tab', { name: 'Prijzen' })
      .locator('.fa-exclamation-circle'),
  ).toBeVisible();

  await page.getByRole('tab', { name: 'Prijzen' }).click();

  await page.getByPlaceholder('Prijs').fill('15');

  await page.locator('.tab-pane.active').click();

  await expect(
    page.getByRole('tab', { name: 'Prijzen' }).locator('.fa-check-circle'),
  ).toBeVisible();

  // go to organizer tab to verify if event is considered an uitpas organizer
  await page.getByRole('tab', { name: 'Organisatie' }).click();
  await expect(
    page
      .locator('.alert-success')
      .getByText('Je activiteit is nu geregistreerd als UiTPAS activiteit'),
  ).toBeVisible();

  await expect(page.getByText('UiTPAS Kaartsystemen')).toBeVisible();

  // check for active cardsystem
  await expect(page.getByLabel('UiTPAS')).toBeChecked();

  // Publish
  await page.getByRole('button', { name: 'Publiceren', exact: true }).click();
});
