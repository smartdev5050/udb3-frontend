import { waitFor } from '@testing-library/react';

const waitForFetchToFinish = async (url) => {
  await waitFor(() => expect(fetch).toBeCalledWith(url, expect.anything()));
};

export { waitForFetchToFinish };
