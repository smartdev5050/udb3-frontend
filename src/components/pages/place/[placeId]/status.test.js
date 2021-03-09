import { place } from '@/test/data/place';
import { parseOfferId } from '@/utils/parseOfferId';
import { setupPage } from '@/test/utils/setupPage';

import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Status from './status';
import nl from '@/i18n/nl.json';

import { renderPageWithWrapper } from '@/test/utils/renderPageWithWrapper';
import { waitForFetch } from '@/test/utils/waitForFetch';
import { OfferStatus } from '@/constants/OfferStatus';

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

  renderPageWithWrapper(<Status />);
  await waitFor(() => screen.getByText(`Status voor ${place.name.nl}`));

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
