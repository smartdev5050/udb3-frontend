import getConfig from 'next/config';
import { useQuery } from 'react-query';

import { FeatureFlags, useFeatureFlag } from '../useFeatureFlag';

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
  const [isNewCreateEnabled] = useFeatureFlag(FeatureFlags.REACT_CREATE);
  return useQuery(
    ['announcement', { includeDisabled: isNewCreateEnabled }],
    getAnnouncements,
    configuration,
  );
};

export { useGetAnnouncementsQuery };
