import { expect, test } from '@playwright/test';

const randomUniqueUrl = `https://e2e-organizer-${Math.random()
  .toString(36)
  .substring(2, 7)}.com`;

const dummyPlace = {
  name: 'E2E test location',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a porta leo. Etiam sit amet cursus diam. Donec finibus luctus tincidunt. Quisque a lectus nunc. Maecenas rutrum varius orci, eget placerat sapien fermentum non.',
  address: {
    zip: '9000',
    municipality: '9000 Gent',
    streetAndNumber: 'E2E test street 1',
  },
  contactInfo: {
    email: 'e2e.udb3.frontend@gmail.com',
  },
  bookingInfo: {
    email: 'e2e.udb3.frontend@gmail.com',
  },
  image: {
    description: 'image for e2e place',
    copyright: 'e2e test location',
  },
  video: 'https://www.youtube.com/watch?v=lkIFF4maKMU&t=48s',
  organizer: {
    name: 'E2E organizer for location',
    url: randomUniqueUrl,
    zip: '9000',
    municipality: '9000 Gent',
    streetAndNumber: 'E2E test street 1',
  },
};

test('create a place', async ({ baseURL, page }) => {
  await page.goto(`${baseURL}/create`);
  // 1. Select location
  await page.getByRole('button', { name: 'Locatie' }).click();
  // // 2. Type
  await page.getByRole('button', { name: 'Bioscoop' }).click();
  // // 3. Date
  await page.getByRole('button', { name: 'Openingsuren toevoegen' }).click();
  // // openinghours
  await page.getByText('Ma', { exact: true }).click();
  await page.getByText('Wo', { exact: true }).click();
  await page.getByText('Vr', { exact: true }).click();
  await page.getByRole('button', { name: 'Opslaan' }).click();
  // // 4. Address
  await page.getByLabel('Gemeente').click();
  await page.getByLabel('Gemeente').fill(dummyPlace.address.zip);
  await page
    .getByRole('option', { name: dummyPlace.address.municipality })
    .click();
  await page.getByLabel('Straat en nummer').click();
  await page
    .getByLabel('Straat en nummer')
    .fill(dummyPlace.address.streetAndNumber);
  // // 5. Name and Age
  await page.getByLabel('Naam van de locatie').click();
  await page.getByLabel('Naam van de locatie').fill(dummyPlace.name);
  await page.getByRole('button', { name: 'Volwassenen 18+' }).click();
  await page.getByRole('button', { name: 'Opslaan' }).click();
  // // 6. Additionnal Information
  await page
    .getByRole('textbox', { name: 'rdw-editor' })
    .fill(dummyPlace.description);
  await page
    .getByRole('tabpanel')
    .locator('section')
    .filter({ hasText: dummyPlace.description })
    .click();
  await expect(
    page.getByRole('tab', { name: 'Beschrijving' }).locator('.fa-check-circle'),
  ).toBeVisible();
  // // Add image & video url
  await page.getByRole('tab', { name: 'Afbeelding & video' }).click();
  await page.getByRole('button', { name: 'Afbeelding toevoegen' }).click();
  await page.setInputFiles('input[type="file"]', 'upload/e2e-image.jpg');
  await page.getByLabel('Beschrijving').fill(dummyPlace.image.description);
  await page.getByLabel('Copyright').fill(dummyPlace.image.copyright);
  await page.getByRole('button', { name: 'Uploaden' }).click();
  await expect(page.getByText(dummyPlace.image.description)).toBeVisible();
  await page.getByRole('button', { name: 'Video-link toevoegen' }).click();
  await page.getByLabel('Link').fill(dummyPlace.video);
  await page.getByRole('button', { name: 'Toevoegen' }).click();
  await expect(page.getByRole('img', { name: 'video' })).toBeVisible();
  await expect(page.getByText(dummyPlace.video)).toBeVisible();
  await expect(
    page
      .getByRole('tab', { name: 'Afbeelding & video' })
      .locator('.fa-check-circle'),
  ).toBeVisible();
  // // Prices
  await page.getByRole('tab', { name: 'Prijzen' }).click();
  await page.getByPlaceholder('Prijs').click();
  await page.getByPlaceholder('Prijs').fill('10');
  await page.getByText('BasistariefeuroGratisTarief toevoegen').click();
  await expect(
    page.getByRole('tab', { name: 'Prijzen' }).locator('.fa-check-circle'),
  ).toBeVisible();
  // Organizer
  await page.getByRole('tab', { name: 'Organisatie' }).click();
  await page.getByRole('button', { name: 'Organisatie toevoegen' }).click();
  await page.locator('#organizer-picker').fill(dummyPlace.organizer.name);
  await page.locator('.rbt-menu-custom-option').click();
  await page.locator('#organizer-url').fill(dummyPlace.organizer.url);
  await page
    .getByLabel('Straat en nummer')
    .fill(dummyPlace.organizer.streetAndNumber);
  await page.getByLabel('Gemeente').fill(dummyPlace.organizer.zip);
  await page
    .getByRole('option', { name: dummyPlace.organizer.municipality })
    .click();
  await page.getByRole('button', { name: 'Toevoegen', exact: true }).click();
  await expect(
    page.getByRole('tab', { name: 'Organisatie' }).locator('.fa-check-circle'),
  ).toBeVisible();
  // Contact
  await page.getByRole('tab', { name: 'Contact' }).click();
  await page.getByRole('button', { name: 'Contactgegevens toevoegen' }).click();
  await page.locator('#contact-info-value').click();
  await page.locator('#contact-info-value').fill(dummyPlace.contactInfo.email);
  await page
    .getByRole('button', { name: 'Meer contactgegevens toevoegen' })
    .click();
  await expect(
    page.getByRole('tab', { name: 'Contact' }).locator('.fa-check-circle'),
  ).toBeVisible();
  // BookingInfo
  await page.getByRole('tabpanel').click();
  await page.getByRole('tab', { name: 'Reservatie' }).click();
  await page.getByPlaceholder('E-mailadres').click();
  await page.getByPlaceholder('E-mailadres').fill(dummyPlace.bookingInfo.email);
  await page.getByPlaceholder('Telefoonnummer').click();
  await expect(
    page.getByRole('tab', { name: 'Reservatie' }).locator('.fa-check-circle'),
  ).toBeVisible();
  // Check offer score
  await expect(page.locator('#offer-score').getByText('100')).toBeVisible();
  // 5. Publish
  await page.getByRole('button', { name: 'Publiceren', exact: true }).click();
  // await page.waitForLoadState('networkidle');
  // // 6. Verify if created location is visible on dashboard
  // await page.goto(`${baseURL}/dashboard?tab=places&page=1`);
  // await expect(page.getByText(dummyPlace.name).first()).toBeVisible();
});
