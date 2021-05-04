import '@testing-library/jest-dom';

import base64 from 'base-64';
import fetchMock from 'jest-fetch-mock';
import { setConfig } from 'next/config';

fetchMock.enableMocks();

// eslint-disable-next-line no-console
console.error = jest.fn();

jest.mock('@/layouts/Sidebar.js', () => ({
  __esModule: true,
  Sidebar: () => {
    return null;
  },
}));

const createToken = () => {
  const header = base64.encode(JSON.stringify({ test: 'ok' }));
  const payload = base64.encode(
    // eslint-disable-next-line no-loss-of-precision
    JSON.stringify({ exp: 99999999999999999999999999999999999999999 }),
  );
  return [header, payload, 'SIGNATURE'].join('.');
};

jest.mock('@/hooks/useCookiesWithOptions.js', () => ({
  __esModule: true,
  useCookiesWithOptions: () => ({
    cookies: {
      token: createToken(),
    },
    setCookie: jest.fn(),
    removeCookie: jest.fn(),
    removeAuthenticationCookies: jest.fn(),
  }),
}));

setConfig({
  publicRuntimeConfig: { apiUrl: 'http://localhost:3000' },
});
