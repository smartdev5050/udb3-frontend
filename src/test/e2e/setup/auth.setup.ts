// auth.setup.ts
import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ baseURL, page }) => {
  await page.goto(`/login/nl`);

  await page.getByRole('button', { name: 'Start hier' }).click();

  await page.waitForURL(new RegExp(/publiq-acc.eu.auth0.com\/*/));

  await page.getByLabel('Je e-mailadres').fill(process.env.E2E_TEST_EMAIL);
  await page.getByLabel('Je wachtwoord').fill(process.env.E2E_TEST_PASSWORD);

  await page.getByRole('button', { name: 'Meld je aan', exact: true }).click();

  await page.waitForURL(new RegExp(`${baseURL}/dashboard*`));

  await page.getByText('Welkom, e2e.udb3.frontend').waitFor();

  await page.context().storageState({ path: authFile });
});
