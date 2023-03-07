// auth.setup.ts
import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page, baseURL }) => {
  console.log('baseURL', baseURL);
  await page.goto(
    `${baseURL}/login/nl?referer=http%3A%2F%2Flocalhost%3A3000%2Fdashboard`,
    {
      timeout: 60000, // 60 seconds
    },
  );
  await page.getByRole('button', { name: 'Start hier' }).click();
  await page.getByLabel('Je e-mailadres').click();
  await page.getByLabel('Je e-mailadres').fill(process.env.E2E_TEST_EMAIL);
  await page.getByLabel('Je wachtwoord').click();
  await page.getByLabel('Je wachtwoord').fill(process.env.E2E_TEST_PASSWORD);
  await page.getByRole('button', { name: 'Meld je aan', exact: true }).click();
  await page.getByText('Welkom, e2e.udb3.frontend').waitFor();

  await page.context().storageState({ path: authFile });
});
