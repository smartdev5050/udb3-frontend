import { mockRouterWithParams } from '../mocks/mockRouterWithParams';

const setupPage = ({ router } = {}) => {
  fetch.resetMocks();
  mockRouterWithParams(router);
};

export { setupPage };
