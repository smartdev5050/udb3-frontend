import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import { setConfig } from 'next/config';

fetchMock.enableMocks();
console.error = jest.fn();

jest.mock('./src/components/Sidebar.js', () => ({
  __esModule: true,
  Sidebar: () => {
    return null;
  },
}));

setConfig({
  publicRuntimeConfig: { apiUrl: 'http://localhost:3000' },
});
