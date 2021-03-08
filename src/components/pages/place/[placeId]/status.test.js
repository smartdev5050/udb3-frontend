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
  describe('When the current status of the place is "available"', () => {
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

    it('checks the value "available" by default', () => {
      expect(
        screen.getByLabelText(nl.offerStatus.status.place.available),
      ).toBeChecked();
    });

    it('disables the textarea for reason when the place is "available"', () => {
      expect(screen.getByLabelText(nl.offerStatus.reason)).toBeDisabled();
    });

    it('redirects to the preview page when the save button is pressed', async () => {
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

    it('redirects to edit page when the cancel button is pressed', () => {
      userEvent.click(
        screen.getByRole('button', {
          name: nl.offerStatus.actions.cancel,
        }),
      );

      expect(page.router.push).toBeCalledWith(
        `/place/${page.router.query.placeId}/edit`,
      );
    });
  });
  describe('When changing the status to temporarily unavailable', () => {
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

      userEvent.click(
        screen.getByLabelText(
          nl.offerStatus.status.place.temporarilyUnavailable,
        ),
      );
    });

    it('enabled the textarea for reason', () => {
      expect(screen.getByLabelText(nl.offerStatus.reason)).toBeEnabled();
    });

    it('redirects to edit page when the cancel button is pressed', () => {
      userEvent.click(
        screen.getByRole('button', {
          name: nl.offerStatus.actions.cancel,
        }),
      );

      expect(page.router.push).toBeCalledWith(
        `/place/${page.router.query.placeId}/edit`,
      );
    });

    it('disables the save button and show error when the reason is too long', () => {
      userEvent.type(
        screen.getByLabelText(nl.offerStatus.reason),
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et ullamcorper dui. Mauris arcu mauris, dapibus ac fringilla ut, elementum eget urna. Mauris est velit, commodo rutrum est fermentum non. test',
      );

      expect(
        screen.getByRole('button', {
          name: nl.offerStatus.actions.save,
        }),
      ).toBeDisabled();
    });

    it('empties and disables the textarea when selecting "Available"', () => {
      userEvent.type(
        screen.getByLabelText(nl.offerStatus.reason),
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et ullamcorper dui. Mauris arcu mauris, dapibus ac fringilla ut, elementum eget urna. Mauris est velit, commodo rutrum est fermentum.',
      );

      userEvent.click(
        screen.getByLabelText(nl.offerStatus.status.place.available),
      );

      expect(screen.getByLabelText(nl.offerStatus.reason).value).toBe('');
      expect(screen.getByLabelText(nl.offerStatus.reason)).toBeDisabled();
    });

    it('redirects to the preview page when the save button is pressed', async () => {
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
