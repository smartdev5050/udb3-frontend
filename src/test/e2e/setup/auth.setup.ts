// auth.setup.ts
import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ baseURL, page }) => {
  await page.goto(`/login/nl`);

  await page.getByRole('button', { name: 'Start hier' }).click();

  await page.waitForURL(/publiq-acc.eu.auth0.com\/*/);

  await page.getByLabel('Je e-mailadres').fill(process.env.E2E_TEST_EMAIL);
  await page.getByLabel('Je wachtwoord').fill(process.env.E2E_TEST_PASSWORD);

  await page.getByRole('button', { name: 'Meld je aan', exact: true }).click();

  // Now we're back to our own app
  // Wait that the main page has loaded
  await page.waitForURL(new RegExp(`${baseURL}/dashboard*`), {
    timeout: 60_000,
  });

  // Wait for network to be idle, if we save storage too early, needed storage values might not yet be available
  await page.waitForLoadState('networkidle');

  await page.getByText('Welkom, e2e.udb3.frontend').waitFor();

  await page.context().storageState({ path: authFile });
});
