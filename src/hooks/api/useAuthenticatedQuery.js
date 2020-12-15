import { useRouter } from 'next/router';
import { useQuery as useReactQuery } from 'react-query';
import { Errors } from '../../utils/fetchWithRedirect';
import { useCookiesWithOptions } from '../useCookiesWithOptions';
import { useHeaders } from './useHeaders';

const useAuthenticatedQuery = ({
  queryKey: rawQueryKey = [],
  queryFn = () => {},
  queryArguments = {},
  configuration = {},
} = {}) => {
  const { asPath, ...router } = useRouter();
  const headers = useHeaders();
  const [cookies] = useCookiesWithOptions(['token']);

  const {
    enabled: configurationEnabled = true,
    ...cleanedConfiguration
  } = configuration;

  const queryKey = [
    ...rawQueryKey,
    Object.keys(queryArguments).length > 0 ? queryArguments : undefined,
  ].filter((key) => key !== undefined);

  const result = useReactQuery({
    queryKey,
    queryFn: () => queryFn({ ...queryArguments, headers }),
    enabled: !!cookies?.token && configurationEnabled,
    ...cleanedConfiguration,
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

export { useAuthenticatedQuery };
