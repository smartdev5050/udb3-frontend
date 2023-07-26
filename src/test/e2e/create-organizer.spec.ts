import { faker } from '@faker-js/faker';
import { test } from '@playwright/test';

const dummyOrganizer = {
  name: faker.lorem.word(),
  website: faker.internet.url(),
  description: faker.lorem.paragraphs(3),
  email: faker.internet.email(),
};

test('create an organizer', async ({ baseURL, page }) => {
  // Navigate to form
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
  await page.locator('#contact-info-value').click();
  await page.locator('#contact-info-value').fill(dummyOrganizer.email);
  await page.locator('#contact-info-value').blur();

  await page.getByRole('tab', { name: 'Locatie' }).click();
  await page.getByLabel('Gemeente').click();
  await page.getByLabel('Gemeente').fill('gent');
  await page.getByLabel('9000 Gent').click();
  await page.getByLabel('Straat en nummer').click();
  await page.getByLabel('Straat en nummer').fill('rab');
  await page.getByLabel('Straat en nummer').blur();

  await page.getByRole('tab', { name: 'Labels' }).click();
  await page.getByLabel('Verfijn met labels').click();
  await page.getByLabel('Verfijn met labels').fill('foo');
  await page.getByLabel('american football').click();
  await page.getByLabel('Verfijn met labels').blur();

  await page.getByLabel('Bewaren').click();
});
