import getConfig from 'next/config';
import { useCookiesWithOptions } from '../useCookiesWithOptions';

const useHeaders = (headers = {}) => {
  const { cookies } = useCookiesWithOptions(['token']);
  const { publicRuntimeConfig } = getConfig();

  return {
    Authorization: `Bearer ${cookies.token}`,
    'X-Api-Key': publicRuntimeConfig.apiKey,
    ...headers,
  };
};

export { useHeaders };
