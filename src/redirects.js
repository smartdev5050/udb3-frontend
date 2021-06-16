import { tabOptions } from '@/pages/dashboard';

import { FeatureFlags } from './hooks/useFeatureFlag';

const createDashboardRedirects = (environment) => {
  return [
    {
      source: '/dashboard',
      destination: '/dashboard?tab=events&page=1',
      permanent: environment !== 'development',
      featureFlag: FeatureFlags.REACT_DASHBOARD,
    },
    ...tabOptions.map((tabName) => {
      const source = `/dashboard?tab=${tabName}`;
      return {
        source,
        destination: `${source}&page=1`,
        permanent: environment !== 'development',
        featureFlag: FeatureFlags.REACT_DASHBOARD,
      };
    }),
  ];
};

const getRedirects = (environment) => [
  // Only make the permanent redirects really permanent in environments other
  // than development, so we don't get permanent redirects on localhost which
  // may conflict with other projects.

  {
    source: '/event/:eventId/status',
    destination: '/events/:eventId/status',
    permanent: environment !== 'development',
  },
  {
    source: '/place/:placeId/status',
    destination: '/places/:placeId/status',
    permanent: environment !== 'development',
  },
  ...createDashboardRedirects(environment),
  {
    source: '/events',
    destination: '/dashboard?tab=events&page=1',
    permanent: environment !== 'development',
    featureFlag: FeatureFlags.REACT_DASHBOARD,
  },
  {
    source: '/organizers',
    destination: '/dashboard?tab=organizers&page=1',
    permanent: environment !== 'development',
    featureFlag: FeatureFlags.REACT_DASHBOARD,
  },
  {
    source: '/places',
    destination: '/dashboard?tab=places&page=1',
    permanent: environment !== 'development',
    featureFlag: FeatureFlags.REACT_DASHBOARD,
  },
];

export { getRedirects };
