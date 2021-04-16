exports.getRedirects = (environment) => [
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
];
