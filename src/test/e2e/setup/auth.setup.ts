// auth.setup.ts
import { test as setup } from '@playwright/test';
import { startsWith } from 'lodash';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ baseURL, browser }) => {
  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(
      '/login/nl?referer=http%3A%2F%2Flocalhost%3A3000%2Fdashboard',
    );

    await page.getByRole('button', { name: 'Start hier' }).click();
    await page.waitForURL(new RegExp(/publiq-acc.eu.auth0.com\/*/));
    await page.getByLabel('Je e-mailadres').fill(process.env.E2E_TEST_EMAIL);
    await page.getByLabel('Je wachtwoord').fill(process.env.E2E_TEST_PASSWORD);
    await page
      .getByRole('button', { name: 'Meld je aan', exact: true })
      .click();
    await page.waitForURL((url) => url.toString().startsWith(baseURL));
    await page.getByText('Welkom, e2e.udb3.frontend').waitFor();

    await page.context().storageState({ path: authFile });

    // Gracefully close up everything
    await context.close();
    await browser.close();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  } finally {
    browser.close();
  }
});
