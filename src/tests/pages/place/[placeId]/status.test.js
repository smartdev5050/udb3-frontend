import { place } from '../../../data/place';
import { parseOfferId } from '../../../../utils/parseOfferId';
import { setupPage } from '../../../utils/setupPage';

import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Status from '../../../../pages/place/[placeId]/status';
import nl from '../../../../i18n/nl.json';

import { renderPageWithWrapper } from '../../../utils/renderPageWithWrapper';
import { waitForFetch } from '../../../utils/waitForFetch';

describe('Status page place', () => {
  describe('When the status "Available" is loaded from place object', () => {
    let router;

    beforeEach(async () => {
      router = setupPage({
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
      expect(screen.getByLabelText(nl.offerStatus.status.open)).toBeChecked();
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

      expect(router.push).toBeCalledWith(`/place/${router.query.placeId}/edit`);
    });

    it('redirects to preview page when button save is pressed', async () => {
      userEvent.click(
        screen.getByLabelText(nl.offerStatus.status.temporarilyClosed),
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

      await waitForFetch(`/places/${router.query.placeId}/status`);

      expect(router.push).toBeCalledWith(
        `/place/${router.query.placeId}/preview`,
      );
    });
  });
});
