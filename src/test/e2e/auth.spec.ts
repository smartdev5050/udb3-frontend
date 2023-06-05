import { expect, test } from '@playwright/test';

test('can authenticate', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/dashboard?tab=events&page=1&sort=created_desc`);

  await expect(page.getByText('Welkom, end to end')).toBeVisible();
});
