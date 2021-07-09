import type { SupportedLanguage } from './i18n';

const tabOptions = ['events', 'organizers', 'places'];

type Environment = 'development' | 'acceptance' | 'testing' | 'production';

const createDashboardRedirects = (environment: Environment) => {
  return [
    {
      source: '/dashboard',
      destination: '/dashboard?tab=events&page=1',
      permanent: environment !== 'development',
    },
    {
      source: '/events',
      destination: '/dashboard?tab=events&page=1',
      permanent: environment !== 'development',
    },
    {
      source: '/organizers',
      destination: '/dashboard?tab=organizers&page=1',
      permanent: environment !== 'development',
    },
    {
      source: '/places',
      destination: '/dashboard?tab=places&page=1',
      permanent: environment !== 'development',
    },
    ...tabOptions.map((tabName) => {
      const source = `/dashboard?tab=${tabName}`;
      return {
        source,
        destination: `${source}&page=1`,
        permanent: environment !== 'development',
      };
    }),
  ];
};

const getRedirects = (
  environment: Environment,
  language: SupportedLanguage = 'nl',
) => [
  // Only make the permanent redirects really permanent in environments other
  // than development, so we don't get permanent redirects on localhost which
  // may conflict with other projects.
  {
    source: '/create',
    destination: '/event',
    permanent: false,
  },
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
  ...(language !== 'nl'
    ? [
        {
          source: '/manage/movies/create',
          destination: '/dashboard',
          permanent: false,
        },
      ]
    : []),
  ...createDashboardRedirects(environment),
];

export { getRedirects };
