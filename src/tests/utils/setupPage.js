import { mockRouterWithParams } from '../mocks/mockRouterWithParams';
import { createCookieWithToken } from './createCookieWithToken';

const setupPage = ({ router } = {}) => {
  fetch.resetMocks();
  mockRouterWithParams(router);
  createCookieWithToken();
};

export { setupPage };
