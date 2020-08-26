const suggestedEvents = [
  {
    '@id':
      'https://io.uitdatabank.dev/event/e4ce532b-d74e-4778-8c98-b0b4560990a9',
    '@context': '/contexts/event',
    mainLanguage: 'nl',
    name: { nl: 'eee' },
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
      modified: '2020-08-25T08:41:42+00:00',
      creator: 'google-oauth2|104823890460871396997',
      workflowStatus: 'READY_FOR_VALIDATION',
      languages: ['nl'],
      completedLanguages: ['nl'],
      geo: { latitude: 51.06783069999999, longitude: 3.7290914 },
      availableFrom: '2020-08-25T10:41:42+02:00',
    },
    calendarType: 'single',
    startDate: '2020-06-22T22:00:00+00:00',
    endDate: '2020-06-23T21:59:59+00:00',
    subEvent: [
      {
        '@type': 'Event',
        startDate: '2020-06-22T22:00:00+00:00',
        endDate: '2020-06-23T21:59:59+00:00',
      },
    ],
    availableTo: '2020-06-23T21:59:59+00:00',
    sameAs: [
      'http://www.uitinvlaanderen.be/agenda/e/eee/e4ce532b-d74e-4778-8c98-b0b4560990a9',
    ],
    terms: [{ id: '0.49.0.0.0', label: 'Party of fuif', domain: 'eventtype' }],
    created: '2020-06-23T11:43:12+00:00',
    modified: '2020-06-23T11:43:14+00:00',
    creator: 'google-oauth2|104823890460871396997',
    workflowStatus: 'READY_FOR_VALIDATION',
    audience: { audienceType: 'everyone' },
    languages: ['nl'],
    completedLanguages: ['nl'],
    availableFrom: '2020-06-23T13:43:14+02:00',
  },
  {
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
      modified: '2020-08-25T08:41:42+00:00',
      creator: 'google-oauth2|104823890460871396997',
      workflowStatus: 'READY_FOR_VALIDATION',
      languages: ['nl'],
      completedLanguages: ['nl'],
      geo: { latitude: 51.06783069999999, longitude: 3.7290914 },
      availableFrom: '2020-08-25T10:41:42+02:00',
    },
    calendarType: 'single',
    startDate: '2020-07-14T22:00:00+00:00',
    endDate: '2020-07-15T21:59:59+00:00',
    subEvent: [
      {
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
  },
];

const suggestedEventsWithProductions = [
  {
    '@id':
      'https://io.uitdatabank.dev/event/e4ce532b-d74e-4778-8c98-b0b4560990a9',
    '@context': '/contexts/event',
    mainLanguage: 'nl',
    name: { nl: 'eee' },
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
      modified: '2020-08-25T08:41:42+00:00',
      creator: 'google-oauth2|104823890460871396997',
      workflowStatus: 'READY_FOR_VALIDATION',
      languages: ['nl'],
      completedLanguages: ['nl'],
      geo: { latitude: 51.06783069999999, longitude: 3.7290914 },
      availableFrom: '2020-08-25T10:41:42+02:00',
    },
    calendarType: 'single',
    startDate: '2020-06-22T22:00:00+00:00',
    endDate: '2020-06-23T21:59:59+00:00',
    subEvent: [
      {
        '@type': 'Event',
        startDate: '2020-06-22T22:00:00+00:00',
        endDate: '2020-06-23T21:59:59+00:00',
      },
    ],
    availableTo: '2020-06-23T21:59:59+00:00',
    sameAs: [
      'http://www.uitinvlaanderen.be/agenda/e/eee/e4ce532b-d74e-4778-8c98-b0b4560990a9',
    ],
    terms: [{ id: '0.49.0.0.0', label: 'Party of fuif', domain: 'eventtype' }],
    created: '2020-06-23T11:43:12+00:00',
    modified: '2020-06-23T11:43:14+00:00',
    creator: 'google-oauth2|104823890460871396997',
    workflowStatus: 'READY_FOR_VALIDATION',
    audience: { audienceType: 'everyone' },
    languages: ['nl'],
    completedLanguages: ['nl'],
    availableFrom: '2020-06-23T13:43:14+02:00',
    production: {
      id: '8f4633a0-9f9f-4b12-81a3-3ae06a75b155',
      title: 'Testing',
      otherEvents: [
        'https://io.uitdatabank.dev/event/82e6367d-e8f4-4684-9f13-7bddd33d8c98',
      ],
    },
  },
  {
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
      modified: '2020-08-25T08:41:42+00:00',
      creator: 'google-oauth2|104823890460871396997',
      workflowStatus: 'READY_FOR_VALIDATION',
      languages: ['nl'],
      completedLanguages: ['nl'],
      geo: { latitude: 51.06783069999999, longitude: 3.7290914 },
      availableFrom: '2020-08-25T10:41:42+02:00',
    },
    calendarType: 'single',
    startDate: '2020-07-14T22:00:00+00:00',
    endDate: '2020-07-15T21:59:59+00:00',
    subEvent: [
      {
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
    production: {
      id: '8f4633a0-9f9f-4b12-81a3-3ae06a75b156',
      title: 'Testing 2',
      otherEvents: [
        'https://io.uitdatabank.dev/event/82e6367d-e8f4-4684-9f13-7bddd33d8c98',
      ],
    },
  },
];

const suggestedEventsWithOneProduction = [
  {
    '@id':
      'https://io.uitdatabank.dev/event/e4ce532b-d74e-4778-8c98-b0b4560990a9',
    '@context': '/contexts/event',
    mainLanguage: 'nl',
    name: { nl: 'eee' },
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
      modified: '2020-08-25T08:41:42+00:00',
      creator: 'google-oauth2|104823890460871396997',
      workflowStatus: 'READY_FOR_VALIDATION',
      languages: ['nl'],
      completedLanguages: ['nl'],
      geo: { latitude: 51.06783069999999, longitude: 3.7290914 },
      availableFrom: '2020-08-25T10:41:42+02:00',
    },
    calendarType: 'single',
    startDate: '2020-06-22T22:00:00+00:00',
    endDate: '2020-06-23T21:59:59+00:00',
    subEvent: [
      {
        '@type': 'Event',
        startDate: '2020-06-22T22:00:00+00:00',
        endDate: '2020-06-23T21:59:59+00:00',
      },
    ],
    availableTo: '2020-06-23T21:59:59+00:00',
    sameAs: [
      'http://www.uitinvlaanderen.be/agenda/e/eee/e4ce532b-d74e-4778-8c98-b0b4560990a9',
    ],
    terms: [{ id: '0.49.0.0.0', label: 'Party of fuif', domain: 'eventtype' }],
    created: '2020-06-23T11:43:12+00:00',
    modified: '2020-06-23T11:43:14+00:00',
    creator: 'google-oauth2|104823890460871396997',
    workflowStatus: 'READY_FOR_VALIDATION',
    audience: { audienceType: 'everyone' },
    languages: ['nl'],
    completedLanguages: ['nl'],
    availableFrom: '2020-06-23T13:43:14+02:00',
    production: {
      id: '8f4633a0-9f9f-4b12-81a3-3ae06a75b155',
      title: 'Testing',
      otherEvents: [
        'https://io.uitdatabank.dev/event/82e6367d-e8f4-4684-9f13-7bddd33d8c98',
      ],
    },
  },
  {
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
      modified: '2020-08-25T08:41:42+00:00',
      creator: 'google-oauth2|104823890460871396997',
      workflowStatus: 'READY_FOR_VALIDATION',
      languages: ['nl'],
      completedLanguages: ['nl'],
      geo: { latitude: 51.06783069999999, longitude: 3.7290914 },
      availableFrom: '2020-08-25T10:41:42+02:00',
    },
    calendarType: 'single',
    startDate: '2020-07-14T22:00:00+00:00',
    endDate: '2020-07-15T21:59:59+00:00',
    subEvent: [
      {
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
  },
];

const getMockedEventsSet = () => {
  const events = [
    suggestedEvents,
    suggestedEventsWithProductions,
    suggestedEventsWithOneProduction,
  ];
  const index = Math.floor(Math.random() * events.length);
  return events[index];
};

export default getMockedEventsSet;
