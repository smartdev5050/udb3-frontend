import { useRouter } from 'next/router';
import {
  useQuery as useReactQuery,
  QueryStatus as ReactQueryStatus,
} from 'react-query';
import { Errors } from '../../utils/fetchWithRedirect';
import { useCookiesWithOptions } from '../useCookiesWithOptions';
import { useHeaders } from './useHeaders';

const QueryStatus = {
  IDLE: ReactQueryStatus.Idle,
  LOADING: ReactQueryStatus.Loading,
  SUCCESS: ReactQueryStatus.Success,
  ERROR: ReactQueryStatus.Error,
};

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
    router.push('login/');
    return;
  }

  return result;
};

export { useAuthenticatedQuery, QueryStatus };
