import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import { setConfig } from 'next/config';

// console.log(process.env);
fetchMock.enableMocks();

// Make sure you can use "publicRuntimeConfig" within tests.
setConfig({
  publicRuntimeConfig: { apiUrl: 'http://localhost:3000' },
});
