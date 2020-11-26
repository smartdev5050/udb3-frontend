import { useRouter } from 'next/router';
import { useQuery as useReactQuery } from 'react-query';
import { Errors } from '../../utils/fetchWithRedirect';

const useAuthenticatedQuery = (...args) => {
  const router = useRouter();
  const result = useReactQuery(...args);

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
