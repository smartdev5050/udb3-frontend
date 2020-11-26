import { fetchWithRedirect } from '../../utils/fetchWithRedirect';
import { useCookiesWithOptions } from '../useCookiesWithOptions';
import { useAuthenticatedQuery } from './useAuthenticatedQuery';

const getMe = async (token) => {
  const res = await fetchWithRedirect(
    `${process.env.NEXT_PUBLIC_API_URL}/user`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY,
      },
    },
  );
  return await res.json();
};

const useGetUser = (config = {}) => {
  const [cookies] = useCookiesWithOptions(['token']);
  return useAuthenticatedQuery('user', () => getMe(cookies.token), {
    enabled: cookies.token,
    ...config,
  });
};

export { useGetUser };
