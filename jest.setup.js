import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import { setConfig } from 'next/config';

fetchMock.enableMocks();

setConfig({
  publicRuntimeConfig: { apiUrl: 'http://localhost:3000' },
});

beforeEach(() => {
  jest.spyOn(console, 'error');
  // eslint-disable-next-line no-console
  console.error.mockImplementation(() => null);
});
