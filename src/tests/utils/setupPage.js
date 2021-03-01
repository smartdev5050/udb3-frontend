import { mockRouterWithParams } from '../mocks/mockRouterWithParams';

const setupPage = ({ router } = {}) => {
  fetch.resetMocks();
  return mockRouterWithParams(router);
};

export { setupPage };
