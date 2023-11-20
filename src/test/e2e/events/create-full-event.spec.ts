import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

const dummyEvent = {
  name: 'E2E test event with all possible fields filled in',
  description: faker.lorem.words(200),
  address: {
    zip: '9000',
    municipality: '9000 Gent',
    place: 'S.M.A.K. - Stedelijk Museum voor Actuele Kunst',
  },
  contactInfo: {
    email: faker.internet.email(),
  },
  bookingInfo: {
    email: faker.internet.email(),
    phone: faker.phone.number('##########'),
    url: faker.internet.url(),
  },
  image: {
    description: faker.lorem.words(5),
    copyright: faker.lorem.words(2),
  },
  video: 'https://www.youtube.com/watch?v=lkIFF4maKMU&t=48s',
  organizer: {
    name: 'E2E organizer for test event',
    url: faker.internet.url(),
    zip: '9000',
    municipality: '9000 Gent',
    streetAndNumber: 'E2E test street 1',
  },
  labels: ['publiq'],
};

test('create event with all possible fields filled in', async ({
  baseURL,
  page,
}) => {
  await page.goto(`${baseURL}/create`);
  // 1. Select location
  await page.getByRole('button', { name: 'Evenement' }).click();
  // // 2. Type and theme
  await page.getByRole('button', { name: 'Concert' }).click();
  await page.getByRole('button', { name: 'Dance muziek' }).click();

  // // 3. Date
  await page
    .locator('#calendar-step-day-day-1date-period-picker-start')
    .fill(faker.date.future().toLocaleDateString('nl-BE'));
  await page.getByRole('button', { name: 'Dag toevoegen' }).click();

  // // 4. Address
  await page.getByLabel('Gemeente').click();
  await page.getByLabel('Gemeente').fill(dummyEvent.address.zip);
  await page
    .getByRole('option', { name: dummyEvent.address.municipality })
    .click();
  await page.getByLabel('Kies een locatie').click();

  await page
    .getByLabel('Kies een locatie')
    .fill(dummyEvent.address.place.substring(0, 3));

  await page
    .getByRole('option', { name: dummyEvent.address.place, exact: true })
    .first()
    .click();

  // // 5. Name and Age
  await page.getByLabel('Naam van het evenement').click();
  await page.getByLabel('Naam van het evenement').fill(dummyEvent.name);

  await page.getByRole('button', { name: 'Volwassenen 18+' }).click();
  await page.getByRole('button', { name: 'Opslaan' }).click();

  // // 6. Additionnal Information
  await page
    .getByRole('textbox', { name: 'rdw-editor' })
    .fill(dummyEvent.description);

  await page.getByText('Geef een enthousiaste').click();

  await expect(
    page.getByRole('tab', { name: 'Beschrijving' }).locator('.fa-check-circle'),
  ).toBeVisible();

  // // Add image & video url
  await page.getByRole('tab', { name: 'Afbeelding & video' }).click();
  await page.getByRole('button', { name: 'Afbeelding toevoegen' }).click();
  await page.setInputFiles('input[type="file"]', 'upload/e2e-image.jpg');
  await page.getByLabel('Beschrijving').fill(dummyEvent.image.description);
  await page.getByLabel('Copyright').fill(dummyEvent.image.copyright);
  await page.getByRole('button', { name: 'Uploaden' }).click();
  await expect(page.getByText(dummyEvent.image.description)).toBeVisible();
  await page.getByRole('button', { name: 'Videolink toevoegen' }).click();
  await page.getByLabel('Link').fill(dummyEvent.video);
  await page.getByRole('button', { name: 'Toevoegen' }).click();
  await expect(page.getByRole('img', { name: 'video' })).toBeVisible();
  await expect(page.getByText(dummyEvent.video)).toBeVisible();
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
  await page.locator('#organizer-picker').fill(dummyEvent.organizer.name);
  await page.locator('.rbt-menu-custom-option').click();
  await page.locator('#organizer-url').fill(dummyEvent.organizer.url);
  await page
    .getByLabel('Straat en nummer')
    .fill(dummyEvent.organizer.streetAndNumber);
  await page.getByLabel('Gemeente').fill(dummyEvent.organizer.zip);
  await page
    .getByRole('option', { name: dummyEvent.organizer.municipality })
    .click();
  await page.getByRole('button', { name: 'Toevoegen', exact: true }).click();
  await expect(
    page.getByRole('tab', { name: 'Organisatie' }).locator('.fa-check-circle'),
  ).toBeVisible();

  // Contact
  await page.getByRole('tab', { name: 'Contact' }).click();
  await page.getByRole('button', { name: 'Contactgegevens toevoegen' }).click();
  await page.getByTestId('contact-info-value').click();
  await page
    .getByTestId('contact-info-value')
    .fill(dummyEvent.contactInfo.email);
  await page
    .getByRole('button', { name: 'Meer contactgegevens toevoegen' })
    .click();
  await expect(
    page.getByRole('tab', { name: 'Contact' }).locator('.fa-check-circle'),
  ).toBeVisible();

  // BookingInfo
  await page.getByRole('tab', { name: 'Reservatie' }).click();
  await page.getByPlaceholder('E-mailadres').click();
  await page.getByPlaceholder('E-mailadres').fill(dummyEvent.bookingInfo.email);
  // TODO fix phone number validation?
  await page.getByPlaceholder('Telefoonnummer').click();
  await page
    .getByPlaceholder('Telefoonnummer')
    .fill(dummyEvent.bookingInfo.phone);

  await page.getByPlaceholder('Website').click();
  await page.getByPlaceholder('Website').fill(dummyEvent.bookingInfo.url);

  await page.getByLabel('Koop tickets').check();

  await page
    .getByRole('button', { name: 'Reservatieperiode toevoegen' })
    .click();

  const startReservationDate = faker.date.future();
  const endReservationDate = faker.date.future({
    refDate: startReservationDate,
  });

  await page
    .locator('#reservation-date-pickerdate-period-picker-start')
    .fill(startReservationDate.toLocaleDateString());

  await page
    .locator('#reservation-date-pickerdate-period-picker-end')
    .fill(endReservationDate.toLocaleDateString());

  await expect(
    page.getByRole('tab', { name: 'Reservatie' }).locator('.fa-check-circle'),
  ).toBeVisible();

  // Add labels
  await page.getByRole('tab', { name: 'Labels' }).click();
  // Add existing label
  await page.getByLabel('Verfijn met labels').fill(dummyEvent.labels[0]);
  await page.getByRole('option', { name: dummyEvent.labels[0] }).click();

  // Check offer score
  await expect(page.locator('#current-score').getByText('100')).toBeVisible();

  // 5. Publish
  await page.getByRole('button', { name: 'Publiceren', exact: true }).click();
});
