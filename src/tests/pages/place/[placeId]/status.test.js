import { place as mockedPlace, place } from '../../../data/place';
import { parseOfferId } from '../../../../utils/parseOfferId';
import { setupPage } from '../../../utils/setupPage';
import { TestApp } from '../../../utils/TestApp';
import { user } from '../../../data/user';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import Status from '../../../../pages/place/[placeId]/status';
import { match } from 'path-to-regexp';
import nl from '../../../../i18n/nl.json';
import { mockRouterWithParams } from '../../../mocks/mockRouterWithParams';

const placeId = parseOfferId(mockedPlace['@id']);

describe('Status page place', () => {
  describe('When the status "Available" is loaded from place object', () => {
    beforeEach(async () => {
      setupPage({
        router: {
          query: {
            placeId,
          },
        },
      });

      fetch.mockResponse((req) => {
        const url = req.url.split('http://localhost:3000')[1];

        if (match('/user')(url)) {
          return Promise.resolve({ body: JSON.stringify(user) });
        } else if (match('/place/:id')(url)) {
          return Promise.resolve({ body: JSON.stringify(place) });
        } else {
          return undefined;
        }
      });

      render(<Status />, { wrapper: TestApp });
      await waitFor(() => screen.getByText(`Status voor ${place.name.nl}`));
    });

    it('checks the value "Available"', () => {
      const radioButtonAvailable = screen.getByLabelText(
        nl.offerStatus.status.open,
      );
      expect(radioButtonAvailable).toBeChecked();
    });

    it('disables the textarea for reason', () => {
      const textAreaReason = screen.getByLabelText(nl.offerStatus.reason);
      expect(textAreaReason).toBeDisabled();
    });

    // it('redirects to edit page when button cancel is pressed', () => {
    //   const router = mockRouterWithParams({
    //     query: {
    //       placeId,
    //     },
    //   });

    //   const buttonCancel = screen.getByRole('button', {
    //     name: nl.offerStatus.actions.cancel,
    //   });
    //   fireEvent.click(buttonCancel);

    //   expect(router.push).toHaveBeenCalledWith(`/place/${placeId}/edit`);
    // });

    // it('redirects to preview page when button save is pressed', () => {
    //   const buttonSave = screen.getByRole('button', {
    //     name: nl.offerStatus.actions.save,
    //   });
    //   fireEvent.click(buttonSave);
    //   const router = useRouter();
    //   expect(router.push).toHaveBeenCalledWith(
    //     `/place/${router.query.placeId}/preview`,
    //   );
    // });
  });
});
