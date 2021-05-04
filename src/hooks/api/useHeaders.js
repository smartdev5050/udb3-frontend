import getConfig from 'next/config';

import { useCookiesWithOptions } from '../useCookiesWithOptions';

const createHeaders = (token, extraHeaders) => {
  const { publicRuntimeConfig } = getConfig();

  return {
    Authorization: `Bearer ${token}`,
    'X-Api-Key': publicRuntimeConfig.apiKey,
    ...extraHeaders,
  };
};

const useHeaders = (extraHeaders = {}) => {
  const { cookies } = useCookiesWithOptions(['token']);
  return createHeaders(cookies.token, extraHeaders);
};

export { createHeaders, useHeaders };
