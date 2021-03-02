import { waitFor } from '@testing-library/react';
import getConfig from 'next/config';

const waitForFetch = async (path) => {
  const { publicRuntimeConfig } = getConfig();

  await waitFor(() =>
    expect(fetch).toBeCalledWith(
      `${publicRuntimeConfig.apiUrl}${path}`,
      expect.anything(),
    ),
  );
};

export { waitForFetch };
