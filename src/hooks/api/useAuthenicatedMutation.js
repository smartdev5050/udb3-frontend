import { useRouter } from 'next/router';
import { useMutation as useReactMutation } from 'react-query';
import { Errors } from '../../utils/fetchWithRedirect';
import { useHeaders } from './useHeaders';

const useAuthenticatedMutation = (mutationFunction, config = {}) => {
  const router = useRouter();
  const headers = useHeaders();
  const alteredMutationFunction = (variables) => {
    const result = mutationFunction({ ...variables, headers });

    if (
      result.status === 'error' &&
      result.error.message === Errors.UNAUTHORIZED
    ) {
      router.push('login/');
      return;
    }

    return result;
  };
  return useReactMutation(alteredMutationFunction, config);
};

export { useAuthenticatedMutation };
