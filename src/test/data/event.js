const singleDayEvent = {
  '@id':
    'https://io.uitdatabank.dev/event/82e6367d-e8f4-4684-9f13-7bddd33d8c98',
  '@context': '/contexts/event',
  mainLanguage: 'nl',
  name: { nl: 'eeeee' },
  location: {
    '@id':
      'https://io.uitdatabank.dev/place/bff97b2d-b4eb-4e2b-b1d4-87ada7f0e463',
    '@context': '/contexts/place',
    mainLanguage: 'nl',
    name: { nl: 'ee' },
    address: {
      nl: {
        addressCountry: 'BE',
        addressLocality: 'Gent',
        postalCode: '9000',
        streetAddress: 'eee',
      },
    },
    calendarType: 'permanent',
    availableTo: '2100-01-01T00:00:00+00:00',
    terms: [
      {
        id: '3CuHvenJ+EGkcvhXLg9Ykg',
        label: 'Archeologische Site',
        domain: 'eventtype',
      },
    ],
    created: '2020-06-23T11:43:07+00:00',
    modified: '2020-06-23T11:43:08+00:00',
    creator: 'google-oauth2|104823890460871396997',
    workflowStatus: 'DRAFT',
    languages: ['nl'],
    completedLanguages: ['nl'],
    geo: { latitude: 51.06783069999999, longitude: 3.7290914 },
    status: { type: 'Available' },
  },
  calendarType: 'single',
  startDate: '2020-07-14T22:00:00+00:00',
  endDate: '2020-07-15T21:59:59+00:00',
  subEvent: [
    {
      status: { type: 'Available' },
      '@type': 'Event',
      startDate: '2020-07-14T22:00:00+00:00',
      endDate: '2020-07-15T21:59:59+00:00',
    },
  ],
  availableTo: '2020-07-15T21:59:59+00:00',
  sameAs: [
    'http://www.uitinvlaanderen.be/agenda/e/eeeee/82e6367d-e8f4-4684-9f13-7bddd33d8c98',
  ],
  terms: [{ id: '0.50.4.0.0', label: 'Concert', domain: 'eventtype' }],
  created: '2020-07-15T13:53:05+00:00',
  modified: '2020-07-15T13:53:08+00:00',
  creator: 'google-oauth2|104823890460871396997',
  workflowStatus: 'READY_FOR_VALIDATION',
  audience: { audienceType: 'everyone' },
  languages: ['nl'],
  completedLanguages: ['nl'],
  availableFrom: '2020-07-15T15:53:08+02:00',
  production: null,
  status: { type: 'Available' },
};

export { singleDayEvent };
