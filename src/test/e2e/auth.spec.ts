import { expect, test } from '@playwright/test';

test('can authenticate', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/dashboard?tab=events&page=1&sort=created_desc`);

  await expect(page.getByText('Welkom, e2e.udb3.frontend')).toBeVisible();
});
