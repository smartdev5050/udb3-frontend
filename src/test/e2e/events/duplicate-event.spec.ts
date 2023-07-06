import { faker } from '@faker-js/faker';
import { test } from '@playwright/test';

const EVENT_ID = 'ad57130d-8059-4226-b18b-f6e51006fb25';
const TITLE = 'E2E test event to duplicate';
const DESCRIPTION = faker.lorem.words(50);

test('duplicate an event', async ({ baseURL, page }) => {
  await page.goto(`${baseURL}/events/${EVENT_ID}/duplicate`);

  const startDate = faker.date.future();
  const endDate = faker.date.future({
    refDate: startDate,
  });

  // change date
  await page
    .locator('#calendar-step-day-day-2date-period-picker-start')
    .fill(startDate.toLocaleDateString('nl-BE'));
  await page
    .locator('#calendar-step-day-day-2date-period-picker-end')
    .fill(endDate.toLocaleDateString('nl-BE'));

  await page.getByRole('button', { name: 'Kopiëren en aanpassen' }).click();

  await page.getByLabel('Naam van het evenement').click();
  await page.getByLabel('Naam van het evenement').fill('E2E duplicated event');

  await page.getByRole('textbox', { name: 'rdw-editor' }).fill(DESCRIPTION);

  // Publish
  await page.getByRole('button', { name: 'Publiceren', exact: true }).click();
});
