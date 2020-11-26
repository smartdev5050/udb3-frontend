import { useRouter } from 'next/router';
import { useQuery as useReactQuery } from 'react-query';
import { Errors } from '../../utils/fetchWithRedirect';
import { useCookiesWithOptions } from '../useCookiesWithOptions';
import { useHeaders } from './useHeaders';

const useAuthenticatedQuery = (...args) => {
  const router = useRouter();
  const headers = useHeaders();
  const [cookies] = useCookiesWithOptions(['token']);
  const [[key, queryArgs], queryFunction, config] = args;

  const alteredArgs = [
    [
      key,
      {
        headers,
        ...queryArgs,
      },
    ],
    queryFunction,
    { enabled: cookies.token, ...config },
  ];

  const result = useReactQuery(...alteredArgs);

  if (
    result.status === 'error' &&
    result.error.message === Errors.UNAUTHORIZED
  ) {
    router.push('login/');
    return;
  }

  return result;
};

export { useAuthenticatedQuery };
