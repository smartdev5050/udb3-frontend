import { expect, test } from '@playwright/test';

const dummyEvent = {
  name: 'E2E test bookable school event',
};

test('create an event with location in consultation with the school', async ({
  baseURL,
  page,
}) => {
  await page.goto(`${baseURL}/create`);
  // 1. Select event
  await page.getByRole('button', { name: 'Evenement' }).click();
  // 2. Type
  await page.getByRole('button', { name: 'Theatervoorstelling' }).click();
  // 3. Date
  // Use current date

  // 4. Select bookable school event in country picker
  await page.locator('#country-picker').click();
  await page.getByText('Locatie in overleg met de school').click();

  // check for primary alert with info about cultuurkuur
  await expect(
    page
      .locator('.alert-primary')
      .getByText(
        'Evenementen waarvan de locatie in overleg wordt bepaald, verschijnen op cultuurkuur.be',
      ),
  ).toBeVisible();

  // 5. Name and Age
  await page.getByLabel('Naam van het evenement').click();
  await page.getByLabel('Naam van het evenement').fill(dummyEvent.name);
  await page.getByRole('button', { name: 'Jongeren' }).click();

  await page.getByRole('button', { name: 'Opslaan' }).click();

  // Publish
  await page.getByRole('button', { name: 'Publiceren', exact: true }).click();
});
