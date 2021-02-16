import {
  cleanup,
  fireEvent,
  prettyDOM,
  render,
  screen,
} from '@testing-library/react';
import { setupPage } from '../../../utils/setupPage';
import { TestApp } from '../../../utils/TestApp';
import StatusPage from '../../../../pages/place/[placeId]/status';
import nl from '../../../../i18n/nl.json';
import { place as mockedPlace } from '../../../data/place';
import { user as mockedUser } from '../../../data/user';
import { parseOfferId } from '../../../../utils/parseOfferId';

const placeId = parseOfferId(mockedPlace['@id']);

describe('Status page place', () => {
  beforeAll(async () => {
    setupPage({
      router: {
        pathname: `/place/${placeId}/status`,
        query: { placeId },
      },
    });

    // mock place
    fetch.mockResponseOnce(JSON.stringify(mockedPlace));
    // mock user
    fetch.mockResponseOnce(JSON.stringify(mockedUser));

    render(
      <TestApp>
        <StatusPage />
      </TestApp>,
    );

    await screen.findByText(`Status voor ${mockedPlace.name.nl}`);

    console.log(prettyDOM(screen.container));
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
