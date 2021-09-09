import { screen, waitFor } from '@testing-library/react/pure';
import userEvent from '@testing-library/user-event';

import { BookingAvailabilityType } from '@/constants/BookingAvailabilityType';
import { OfferStatus } from '@/constants/OfferStatus';
import nl from '@/i18n/nl.json';
import { eventWithSubEvents } from '@/test/data/event';
import { renderPageWithWrapper } from '@/test/utils/renderPageWithWrapper';
import { setupPage } from '@/test/utils/setupPage';
import { waitForFetch } from '@/test/utils/waitForFetch';
import { parseOfferId } from '@/utils/parseOfferId';

import Availability from './availability';

const setup = async () => {
  const page = setupPage({
    router: {
      query: {
        eventId: parseOfferId(eventWithSubEvents['@id']),
      },
    },
    responses: {
      '/event/:id': { body: eventWithSubEvents },
      'events/:id/subEvents': {},
    },
  });

  renderPageWithWrapper(<Availability />);

  await waitFor(() =>
    screen.getByText(
      `Status & beschikbaarheid voor ${eventWithSubEvents.name.nl}`,
    ),
  );

  return page;
};

test('I can save a status', async () => {
  const page = await setup();

  userEvent.click(screen.getByTestId('checkbox-0'));
  userEvent.click(screen.getByTestId('checkbox-2'));

  userEvent.click(
    screen.getByRole('button', {
      name: nl.offerStatus.changeStatus,
    }),
  );

  expect(
    screen.getByRole('button', {
      name: nl.offerStatus.actions.save,
    }),
  ).toBeDisabled();

  userEvent.click(screen.getByLabelText(nl.offerStatus.status.event.available));

  expect(screen.getByLabelText(nl.offerStatus.reason)).toBeDisabled();

  expect(
    screen.getByRole('button', {
      name: nl.offerStatus.actions.save,
    }),
  ).toBeEnabled();

  userEvent.click(
    screen.getByRole('button', {
      name: nl.offerStatus.actions.save,
    }),
  );

  await waitForFetch(`/events/${page.router.query.eventId}/subEvents`);

  // 3rd API call, [url, payload] tuple
  expect(fetch.mock.calls[2][1].body).toEqual(
    JSON.stringify([
      {
        id: 0,
        status: { type: OfferStatus.AVAILABLE, reason: {} },
      },
      {
        id: 2,
        status: { type: OfferStatus.AVAILABLE, reason: {} },
      },
    ]),
  );
});

test('I can save a status with a reason', async () => {
  const page = await setup();

  userEvent.click(screen.getByTestId('checkbox-1'));
  userEvent.click(screen.getByTestId('checkbox-2'));

  userEvent.click(
    screen.getByRole('button', {
      name: nl.offerStatus.changeStatus,
    }),
  );

  userEvent.click(
    screen.getByLabelText(nl.offerStatus.status.event.unavailable),
  );

  expect(screen.getByLabelText(nl.offerStatus.reason)).toBeEnabled();

  userEvent.type(screen.getByLabelText(nl.offerStatus.reason), 'Lorem Ipsum');

  expect(
    screen.getByRole('button', {
      name: nl.offerStatus.actions.save,
    }),
  ).toBeEnabled();

  userEvent.click(
    screen.getByRole('button', {
      name: nl.offerStatus.actions.save,
    }),
  );

  await waitForFetch(`/events/${page.router.query.eventId}/subEvents`);

  // 3rd API call, [url, payload] tuple
  expect(fetch.mock.calls[2][1].body).toEqual(
    JSON.stringify([
      {
        id: 1,
        status: {
          type: OfferStatus.UNAVAILABLE,
          reason: { nl: 'Lorem Ipsum' },
        },
      },
      {
        id: 2,
        status: {
          type: OfferStatus.UNAVAILABLE,
          reason: { nl: 'Lorem Ipsum' },
        },
      },
    ]),
  );
});

test('I can save a booking availability', async () => {
  const page = await setup();

  userEvent.click(screen.getByTestId('checkbox-1'));
  userEvent.click(screen.getByTestId('checkbox-2'));

  userEvent.click(
    screen.getByRole('button', {
      name: nl.bookingAvailability.change,
    }),
  );

  userEvent.click(screen.getByLabelText(nl.bookingAvailability.available));

  userEvent.click(
    screen.getByRole('button', {
      name: nl.bookingAvailability.actions.save,
    }),
  );

  await waitForFetch(`/events/${page.router.query.eventId}/subEvents`);

  // 3rd API call, [url, payload] tuple
  expect(fetch.mock.calls[2][1].body).toEqual(
    JSON.stringify([
      {
        id: 1,
        bookingAvailability: { type: BookingAvailabilityType.AVAILABLE },
      },
      {
        id: 2,
        bookingAvailability: { type: BookingAvailabilityType.AVAILABLE },
      },
    ]),
  );
});
