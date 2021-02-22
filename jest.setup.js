import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import { setConfig } from 'next/config';

fetchMock.enableMocks();
console.error = jest.fn();

setConfig({
  publicRuntimeConfig: { apiUrl: 'http://localhost:3000' },
});
