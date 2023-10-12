import { faker } from '@faker-js/faker';
import { test } from '@playwright/test';

const dummyOrganizer = {
  name: faker.lorem.word(),
  website: faker.internet.url(),
  description: faker.lorem.paragraphs(3),
  email: faker.internet.email(),
  label: 'american football',
  location: {
    municipality: '9000 Gent',
    address: faker.location.streetAddress(),
  },
  image: {
    name: faker.lorem.word(),
    copyright: faker.lorem.word(),
  },
};

test('create an organizer', async ({ baseURL, page }) => {
  await page.goto(`${baseURL}/organizers/create`);

  await page.getByLabel('Naam').click();
  await page.getByLabel('Naam').fill(dummyOrganizer.name);
  await page.getByLabel('Website', { exact: true }).click();
  await page
    .getByLabel('Website', { exact: true })
    .fill(dummyOrganizer.website);
  await page.getByRole('button', { name: 'Opslaan' }).click();

  await page.getByLabel('rdw-editor').click();
  await page.getByLabel('rdw-editor').fill(dummyOrganizer.description);

  await page.getByRole('tab', { name: 'Contact' }).click();
  await page.getByRole('button', { name: 'Contactgegevens toevoegen' }).click();
  await page.getByTestId('contact-info-value').click();
  await page.getByTestId('contact-info-value').fill(dummyOrganizer.email);
  await page.getByTestId('contact-info-value').blur();

  await page.getByRole('tab', { name: 'Labels' }).click();
  await page.getByLabel('Verfijn met labels').click();
  await page.getByLabel('Verfijn met labels').fill(dummyOrganizer.label);
  await page.getByLabel(dummyOrganizer.label).click();
  await page.getByText(dummyOrganizer.label).click();

  await page.getByRole('tab', { name: 'Afbeeldingen' }).click();
  await page.getByRole('button', { name: 'Afbeelding toevoegen' }).click();
  await page.getByRole('button', { name: 'Kies bestand' }).click();
  await page
    .locator('input[type=file]')
    .setInputFiles('./src/test/data/image.png');
  await page.getByLabel('Beschrijving').click();
  await page.getByLabel('Beschrijving').fill(dummyOrganizer.image.name);
  await page.getByLabel('Copyright').click();
  await page.getByLabel('Copyright').fill(dummyOrganizer.image.copyright);
  await page.getByRole('button', { name: 'Uploaden' }).click();
  await page.getByText(`© ${dummyOrganizer.image.copyright}`).click();

  await page.getByRole('tab', { name: 'Adres' }).click();
  await page.getByLabel('Gemeente').click();
  await page.getByLabel('Gemeente').fill(dummyOrganizer.location.municipality);
  await page.getByLabel(dummyOrganizer.location.municipality).click();
  await page.getByLabel('Straat en nummer').click();
  await page
    .getByLabel('Straat en nummer')
    .fill(dummyOrganizer.location.address);
  await page.getByLabel('Straat en nummer').blur();

  await page.getByText('100/100').click();

  await page.getByRole('button', { name: 'Klaar met bewerken' }).click();
});
