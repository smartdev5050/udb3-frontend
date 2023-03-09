import getConfig from 'next/config';
import { useQuery } from 'react-query';

const getAnnouncements = async ({ queryKey }) => {
  const { publicRuntimeConfig } = getConfig();
  const [_key, options] = queryKey;
  const url = new URL(publicRuntimeConfig.newAnnouncementsUrl);
  if (options.includeDisabled) {
    url.searchParams.append('includeDisabled', '1');
  }
  const res = await fetch(url.toString());
  return await res.json();
};

const useGetAnnouncementsQuery = (configuration = {}) => {
  return useQuery(
    ['announcement', { includeDisabled: false }],
    getAnnouncements,
    configuration,
  );
};

export { useGetAnnouncementsQuery };
