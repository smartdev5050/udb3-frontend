import { place } from '@/test/data/place';
import { parseOfferId } from '@/utils/parseOfferId';
import { setupPage } from '@/test/utils/setupPage';

import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Status from './status';
import nl from '@/i18n/nl.json';

import { renderPageWithWrapper } from '@/test/utils/renderPageWithWrapper';
import { waitForFetch } from '@/test/utils/waitForFetch';

describe('Status page place', () => {
  describe('When the status "Available" is loaded from place object', () => {
    let page;

    beforeEach(async () => {
      page = setupPage({
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
    });

    it('checks the value "Available"', () => {
      // render.debug();
      expect(
        screen.getByLabelText(nl.offerStatus.status.place.available),
      ).toBeChecked();
    });

    it('disables the textarea for reason', () => {
      expect(screen.getByLabelText(nl.offerStatus.reason)).toBeDisabled();
    });

    it('redirects to edit page when button cancel is pressed', () => {
      userEvent.click(
        screen.getByRole('button', {
          name: nl.offerStatus.actions.cancel,
        }),
      );

      expect(page.router.push).toBeCalledWith(
        `/place/${page.router.query.placeId}/edit`,
      );
    });

    it('redirects to preview page when button save is pressed', async () => {
      userEvent.click(
        screen.getByLabelText(
          nl.offerStatus.status.place.temporarilyUnavailable,
        ),
      );

      userEvent.type(
        screen.getByLabelText(nl.offerStatus.reason),
        'A random reason',
      );

      userEvent.click(
        screen.getByRole('button', {
          name: nl.offerStatus.actions.save,
        }),
      );

      await waitForFetch(`/places/${page.router.query.placeId}/status`);

      expect(page.router.push).toBeCalledWith(
        `/place/${page.router.query.placeId}/preview`,
      );
    });
  });
});
