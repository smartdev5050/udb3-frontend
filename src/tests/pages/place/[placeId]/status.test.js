import { place as mockedPlace, place } from '../../../data/place';
import { parseOfferId } from '../../../../utils/parseOfferId';
import { setupPage } from '../../../utils/setupPage';
import { TestApp } from '../../../utils/TestApp';
import { user } from '../../../data/user';

import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Status from '../../../../pages/place/[placeId]/status';
import { match } from 'path-to-regexp';
import nl from '../../../../i18n/nl.json';

describe('Status page place', () => {
  describe('When the status "Available" is loaded from place object', () => {
    let router;

    beforeEach(async () => {
      router = setupPage({
        router: {
          query: {
            placeId: parseOfferId(mockedPlace['@id']),
          },
        },
      });

      const mockResponses = [
        { path: '/user', body: user },
        { path: '/place/:id', body: place },
        {
          path: '/places/:id/status',
        },
      ];

      fetch.mockResponse((req) => {
        const url = req.url.split('http://localhost')[1];

        const data = mockResponses.find(({ path, body }) => match(path)(url));
        if (!data) return undefined;

        return Promise.resolve({
          body: JSON.stringify(data.body ?? {}),
          status: data.status ?? 200,
        });
      });

      render(<Status />, { wrapper: TestApp });
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

      await waitFor(() =>
        expect(fetch).toBeCalledWith(
          `http://localhost/places/${router.query.placeId}/status`,
          expect.anything(),
        ),
      );

      expect(router.push).toBeCalledWith(
        `/place/${router.query.placeId}/preview`,
      );
    });
  });
});
