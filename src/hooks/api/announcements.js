import { fetchWithRedirect } from '../../utils/fetchWithRedirect';
import { useAuthenticatedQuery } from './useAuthenticatedQuery';

const getAnnouncements = async () => {
  const res = await fetchWithRedirect(
    process.env.NEXT_PUBLIC_NEW_ANNOUNCEMENTS_URL,
  );
  return await res.json();
};

const useGetAnnouncements = () =>
  useAuthenticatedQuery('announcements', getAnnouncements);

export { useGetAnnouncements };
