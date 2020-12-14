import { useRouter } from 'next/router';
import { useQuery as useReactQuery } from 'react-query';
import { Errors } from '../../utils/fetchWithRedirect';
import { useCookiesWithOptions } from '../useCookiesWithOptions';
import { useHeaders } from './useHeaders';

const useAuthenticatedQuery = (...args) => {
  const router = useRouter();
  const headers = useHeaders();
  const [cookies] = useCookiesWithOptions(['token']);
  const [queryKey, queryFunction, { enabled = true, ...config } = {}] = args;

  const [key, queryArgs] = Array.isArray(queryKey) ? queryKey : [queryKey, {}];

  const alteredArgs = [
    [
      key,
      {
        headers,
        ...queryArgs,
      },
    ],
    queryFunction,
    { enabled: cookies?.token && enabled, ...config },
  ];

  const result = useReactQuery(...alteredArgs);

  if (
    result.status === 'error' &&
    result.error.message === Errors.UNAUTHORIZED
  ) {
    router.push('/login');
  }

  return result;
};

export { useAuthenticatedQuery };
