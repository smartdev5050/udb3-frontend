import { useCookiesWithOptions } from '../useCookiesWithOptions';

const useHeaders = (...headers) => {
  const [cookies] = useCookiesWithOptions(['token']);
  return {
    Authorization: `Bearer ${cookies.token}`,
    'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY,
    ...headers,
  };
};

export { useHeaders };
