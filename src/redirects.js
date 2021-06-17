import { FeatureFlags } from './hooks/useFeatureFlag';

const tabOptions = ['events', 'organizers', 'places'];

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
];

export { getRedirects };
