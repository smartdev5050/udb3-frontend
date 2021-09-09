import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { OfferStatus } from '@/constants/OfferStatus';
import nl from '@/i18n/nl.json';
import { place } from '@/test/data/place';
import { renderPageWithWrapper } from '@/test/utils/renderPageWithWrapper';
import { setupPage } from '@/test/utils/setupPage';
import { waitForFetch } from '@/test/utils/waitForFetch';
import { parseOfferId } from '@/utils/parseOfferId';

import Availability from './availability';

const setup = async () => {
  const page = setupPage({
    router: {
      query: {
        placeId: parseOfferId(place['@id']),
      },
    },
    responses: {
      '/place/:id': { body: place },
      '/places/:id/status': {},
    },
  });

  renderPageWithWrapper(<Availability />);
  await waitFor(() =>
    screen.getByText(`Status & beschikbaarheid voor ${place.name.nl}`),
  );

  return page;
};

test('I can save a status', async () => {
  const page = await setup();

  expect(
    screen.getByLabelText(nl.offerStatus.status.place.available),
  ).toBeChecked();

  expect(screen.getByLabelText(nl.offerStatus.reason)).toBeDisabled();

  userEvent.click(
    screen.getByRole('button', {
      name: nl.offerStatus.actions.save,
    }),
  );

  await waitForFetch(`/places/${page.router.query.placeId}/status`);

  // 3rd API call, [url, payload] tuple
  expect(fetch.mock.calls[2][1].body).toEqual(
    JSON.stringify({
      type: OfferStatus.AVAILABLE,
    }),
  );

  expect(page.router.push).toBeCalledWith(
    `/place/${page.router.query.placeId}/preview`,
  );
});

test('I can save a status with a reason', async () => {
  const page = await setup();

  userEvent.click(
    screen.getByLabelText(nl.offerStatus.status.place.temporarilyUnavailable),
  );

  expect(
    screen.getByLabelText(nl.offerStatus.status.place.available),
  ).not.toBeChecked();

  expect(
    screen.getByLabelText(nl.offerStatus.status.place.temporarilyUnavailable),
  ).toBeChecked();

  expect(screen.getByLabelText(nl.offerStatus.reason)).toBeEnabled();

  const reason = 'Lorem ipsum';

  userEvent.type(screen.getByLabelText(nl.offerStatus.reason), reason);

  userEvent.click(
    screen.getByRole('button', {
      name: nl.offerStatus.actions.save,
    }),
  );

  await waitForFetch(`/places/${page.router.query.placeId}/status`);

  // 3rd API call, [url, payload] tuple
  expect(fetch.mock.calls[2][1].body).toEqual(
    JSON.stringify({
      type: OfferStatus.TEMPORARILY_UNAVAILABLE,
      reason: { nl: reason },
    }),
  );

  expect(page.router.push).toBeCalledWith(
    `/place/${page.router.query.placeId}/preview`,
  );
});

test('The reason and error are cleared when switching back to "available"', async () => {
  await setup();

  userEvent.click(
    screen.getByLabelText(nl.offerStatus.status.place.temporarilyUnavailable),
  );

  userEvent.type(
    screen.getByLabelText(nl.offerStatus.reason),
    'Nam quis nulla. Integer malesuada. In in enim a arcu imperdiet malesuada. Sed vel lectus. Donec odio urna, tempus molestie, porttitor ut, iaculis quis, sem. Phasellus rhoncus. Aenean id metus id velit ullamcorper pulvina',
  );

  expect(screen.getByRole('alert')).toBeInTheDocument();

  expect(
    screen.getByRole('button', {
      name: nl.offerStatus.actions.save,
    }),
  ).toBeDisabled();

  userEvent.click(screen.getByLabelText(nl.offerStatus.status.place.available));

  expect(screen.queryByRole('alert')).not.toBeInTheDocument();

  expect(screen.getByLabelText(nl.offerStatus.reason).value).toBe('');
});

test('I can cancel', async () => {
  const page = await setup();

  userEvent.click(
    screen.getByRole('button', {
      name: nl.offerStatus.actions.cancel,
    }),
  );

  expect(page.router.push).toBeCalledWith(
    `/place/${page.router.query.placeId}/edit`,
  );
});
