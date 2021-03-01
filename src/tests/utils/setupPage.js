import { match } from 'path-to-regexp';
import { user } from '../data/user';
import { mockRouterWithParams } from '../mocks/mockRouterWithParams';

const mockResponses = (responses) => {
  fetch.mockResponse((req) => {
    const url = req.url.split('http://localhost:3000')[1];

    const foundPath = Object.keys(responses).find((path) => match(path)(url));
    if (!foundPath) return undefined;

    const data = responses[foundPath];

    return Promise.resolve({
      body: JSON.stringify(data.body ?? {}),
      status: data.status ?? 200,
    });
  });
};

const setupPage = ({ router, responses = {} } = {}) => {
  fetch.resetMocks();
  mockResponses({ '/user': { body: user }, ...responses });
  return { router: mockRouterWithParams(router) };
};

export { setupPage, mockResponses };
