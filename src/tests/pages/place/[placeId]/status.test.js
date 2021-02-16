import { place as mockedPlace, place } from '../../../data/place';
import { parseOfferId } from '../../../../utils/parseOfferId';
import { setupPage } from '../../../utils/setupPage';
import { TestApp } from '../../../utils/TestApp';
import { user } from '../../../data/user';
import { prettyDOM, render } from '@testing-library/react';
import Status from '../../../../pages/place/[placeId]/status';

const placeId = parseOfferId(mockedPlace['@id']);

describe('Status page place', () => {
  beforeAll(async () => {
    setupPage({
      router: {
        query: {
          placeId,
        },
      },
    });

    fetch.mockIf(/http:\/\/localhost:3000.*/, (req) => {
      const { url } = req;
      if (url.endsWith('/user')) {
        return JSON.stringify(user);
      }
      if (url.endsWith(`/place/${placeId}`)) {
        return JSON.stringify(place);
      }
    });

    const { container, findByText } = render(<Status />, { wrapper: TestApp });
    await findByText(`Status voor ${place.name.nl}`);
    // eslint-disable-next-line no-console
    console.log(prettyDOM(container));
  });

  // afterAll(() => cleanup());

  describe('When the status "Available" is loaded from place object', () => {
    test('', () => {
      expect(true).toBe(true);
    });

    // it('checks the value "Available"', () => {
    //   console.log(document.cookie);
    //   const radioButtonAvailable = screen.getByLabelText(
    //     nl.offerStatus.status.open,
    //   );

    //   expect(radioButtonAvailable).toBeChecked();
    // });

    // it('disables the textarea for reason', () => {
    //   const textAreaReason = screen.getByLabelText(nl.offerStatus.reason);

    //   console.log({ textAreaReason });
    //   expect(textAreaReason).toBeDisabled();
    // });

    // it('redirects to edit page when button cancel is pressed', () => {
    //   const buttonCancel = screen.getByRole('button', {
    //     name: nl.offerStatus.actions.cancel,
    //   });
    //   fireEvent.click(buttonCancel);
    //   const router = useRouter();

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
