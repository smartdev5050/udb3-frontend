const place = {
  '@id':
    'https://io.uitdatabank.dev/place/644c3632-3671-4195-9e0e-f6153646644d',
  '@context': '/contexts/place',
  mainLanguage: 'nl',
  name: { nl: 'UGC' },
  address: {
    nl: {
      addressCountry: 'BE',
      addressLocality: 'Brussel',
      postalCode: '1000',
      streetAddress: 'De Brouckèreplein 38',
    },
  },
  status: { type: 'Available' },
  availableTo: '2100-01-01T00:00:00+00:00',
  terms: [
    {
      id: 'BtVNd33sR0WntjALVbyp3w',
      label: 'Bioscoop',
      domain: 'eventtype',
    },
  ],
  created: '2021-02-02T09:53:10+00:00',
  modified: '2021-02-15T10:34:25+00:00',
  creator: '8033457c-e13e-43eb-9c24-5d03e4741f95',
  workflowStatus: 'READY_FOR_VALIDATION',
  languages: ['nl'],
  completedLanguages: ['nl'],
  geo: { latitude: 50.8518404, longitude: 4.3525126 },
  typicalAgeRange: '0-',
  availableFrom: '2021-02-02T16:51:25+01:00',
  calendarType: 'permanent',
};

export { place };
