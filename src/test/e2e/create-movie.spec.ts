import { faker } from '@faker-js/faker';
import { test } from '@playwright/test';

const dummyMovie = {
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraphs(3),
  place: 'E2E test location',
};

test('create a movie', async ({ baseURL, page }) => {
  // Navigate to form
  await page.goto(baseURL);
  await page.getByRole('link', { name: 'Films' }).click();

  await page.getByRole('button', { name: 'Cinefiel' }).click();

  // Fill in timetable
  await page.locator('#timetable-moviesdate-period-picker-end').click();
  await page
    .locator('.react-datepicker__day:not(.react-datepicker__day--disabled)')
    .first()
    .click();
  await page.locator('#timetable input').nth(0).fill('10');
  await page.locator('#timetable input').nth(1).fill('12');
  await page.locator('#timetable input').nth(2).fill('14');
  await page.locator('#timetable input').nth(3).fill('16');

  // Fill in location
  await page.getByPlaceholder('Naam van bioscoop').fill(dummyMovie.place);
  await page
    .locator('#place-step-item-0', { hasText: 'E2E test street 1' })
    .click();

  // Fill in name
  await page.getByLabel('Kies een naam').fill(dummyMovie.title);
  await page.getByRole('option', { name: dummyMovie.title }).click();

  await page.getByRole('button', { name: 'Opslaan' }).click();
  await page.waitForURL('**/edit');

  // Fill in additional steps
  await page.getByRole('textbox', { name: 'rdw-editor' }).click();
  await page
    .getByRole('textbox', { name: 'rdw-editor' })
    .fill(dummyMovie.description);
  await page.getByRole('tab', { name: 'Prijzen' }).click();
  await page.getByPlaceholder('Prijs').fill('10');
  await page.getByRole('tab', { name: 'Contact' }).click();
  await page.getByRole('button', { name: 'Contactgegevens toevoegen' }).click();
  const contactButton = await page.getByRole('button', {
    name: 'Meer contactgegevens toevoegen',
  });
  await page.locator('#contact-info-value').fill(faker.internet.email());
  await contactButton.click();
  await page.locator('select').nth(2).selectOption('phone');
  await page
    .locator('#contact-info-value')
    .nth(1)
    .fill(faker.phone.number('+336########'));
  await contactButton.click();
  await page.locator('select').nth(3).selectOption('url');
  await page.locator('#contact-info-value').nth(2).fill(faker.internet.url());
  await contactButton.click();
  await page.locator('#contact-info-value').nth(3).fill(faker.internet.email());
  await page.getByRole('tabpanel').getByRole('button').nth(3).click();

  // Publish
  await page.getByRole('button', { name: 'Publiceren', exact: true }).click();
});
