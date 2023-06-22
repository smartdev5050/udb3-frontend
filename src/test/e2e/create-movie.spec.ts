import { test } from '@playwright/test';

const dummyMovie = {
  title: 'My Movie',
  description: 'My Description',
  place: 'E2E test location',
};

test('create a movie', async ({ baseURL, page }) => {
  // Navigate to form
  await page.goto(baseURL);
  await page.getByRole('link', { name: 'Films' }).click();

  // Fill in information
  await page.getByRole('button', { name: 'Cinefiel' }).click();
  await page.getByLabel('Einde').click();
  await page.getByText('juni', { exact: true }).click();
  await page.getByText('juli').click();
  await page
    .getByRole('option', { name: 'Choose zaterdag 1 juli 2023' })
    .click();
  await page.locator('[id="\\32 8\\/06\\/2023-0"]').click();
  await page.locator('[id="\\32 8\\/06\\/2023-0"]').fill('10');
  await page.locator('[id="\\32 8\\/06\\/2023-1"]').click();
  await page.locator('[id="\\32 8\\/06\\/2023-1"]').fill('12');
  await page.locator('[id="\\32 8\\/06\\/2023-2"]').click();
  await page.locator('[id="\\32 8\\/06\\/2023-2"]').fill('14');
  await page.locator('[id="\\32 8\\/06\\/2023-3"]').click();
  await page.locator('[id="\\32 8\\/06\\/2023-3"]').fill('16');
  await page.getByPlaceholder('Naam van bioscoop').click();
  await page.getByPlaceholder('Naam van bioscoop').fill('str');
  await page
    .locator('#place-step-item-0', { hasText: dummyMovie.place })
    .click();
  await page.getByLabel('Kies een naam').click();
  await page.getByLabel('Kies een naam').fill(dummyMovie.title);
  await page.getByRole('option', { name: dummyMovie.title }).click();

  // Fill in additional steps
  await page.getByRole('button', { name: 'Opslaan' }).click();
  await page.getByRole('textbox', { name: 'rdw-editor' }).click();
  await page
    .getByRole('textbox', { name: 'rdw-editor' })
    .fill(dummyMovie.description);
  await page.getByRole('tab', { name: 'Prijzen' }).click();
  await page.getByPlaceholder('Prijs').click();
  await page.getByPlaceholder('Prijs').fill('10');
  await page.getByRole('tab', { name: 'Contact' }).click();
  await page.getByRole('button', { name: 'Contactgegevens toevoegen' }).click();
  await page.locator('#contact-info-value').click();
  await page.locator('#contact-info-value').fill('foo@bar.com');
  await page
    .getByRole('button', { name: 'Meer contactgegevens toevoegen' })
    .click();
  await page.locator('select').nth(2).selectOption('phone');
  await page.locator('#contact-info-value').nth(1).click();
  await page.locator('#contact-info-value').nth(1).fill('+336717171');
  await page
    .getByRole('button', { name: 'Meer contactgegevens toevoegen' })
    .click();
  await page.locator('select').nth(3).selectOption('url');
  await page.locator('#contact-info-value').nth(2).click();
  await page.locator('#contact-info-value').nth(2).fill('google.fr');
  await page
    .getByRole('button', { name: 'Meer contactgegevens toevoegen' })
    .click();
  await page.locator('#contact-info-value').nth(3).click();
  await page.locator('#contact-info-value').nth(3).fill('nope@bar.com');
  await page.getByRole('tabpanel').getByRole('button').nth(3).click();
  await page.getByRole('button', { name: 'Publiceren', exact: true }).click();
  // Confirm information in preview
  await page
    .frameLocator('iframe')
    .getByRole('heading')
    .waitFor({ timeout: 10000 });
  await expect(
    page
      .frameLocator('iframe')
      .getByRole('heading', { name: dummyMovie.title }),
  ).toBeVisible();
  await expect(
    page.frameLocator('iframe').getByRole('cell', { name: dummyMovie.title }),
  ).toBeVisible();
  await expect(
    page
      .frameLocator('iframe')
      .getByRole('cell', { name: 'Film', exact: true }),
  ).toBeVisible();
});
