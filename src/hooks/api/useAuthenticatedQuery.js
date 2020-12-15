import { useRouter } from 'next/router';
import { useQuery as useReactQuery } from 'react-query';
import { Errors } from '../../utils/fetchWithRedirect';
import { useCookiesWithOptions } from '../useCookiesWithOptions';
import { useHeaders } from './useHeaders';

const QueryStatus = {
  IDLE: 'idle',
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
};

const useAuthenticatedQuery = ({
  queryKey: rawQueryKey = [],
  queryFn = () => {},
  queryArguments = {},
  enabled = true,
  ...configuration
} = {}) => {
  const { asPath, ...router } = useRouter();
  const headers = useHeaders();
  const [cookies] = useCookiesWithOptions(['token']);

  const queryKey = [
    ...rawQueryKey,
    Object.keys(queryArguments).length > 0 ? queryArguments : undefined,
  ].filter((key) => key !== undefined);

  const result = useReactQuery({
    queryKey,
    queryFn: () => queryFn({ ...queryArguments, headers }),
    enabled: !!cookies?.token && !!enabled,
    ...configuration,
  });

  if (
    result.status === 'error' &&
    result.error.message === Errors.UNAUTHORIZED
  ) {
    if (!asPath.startsWith('/login') && asPath !== '/[...params]') {
      router.push('/login');
    }
  }

  return result;
};

export { useAuthenticatedQuery, QueryStatus };
