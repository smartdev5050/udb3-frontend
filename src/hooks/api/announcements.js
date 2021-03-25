import getConfig from 'next/config';
import { useQuery } from 'react-query';

const getAnnouncements = async () => {
  const { publicRuntimeConfig } = getConfig();
  const res = await fetch(publicRuntimeConfig.newAnnouncementsUrl);
  return await res.json();
};

const useGetAnnouncements = (configuration = {}) =>
  useQuery(['announcement'], getAnnouncements, configuration);

export { useGetAnnouncements };
