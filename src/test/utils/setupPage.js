import { match } from 'path-to-regexp';

import { user } from '@/test/data/user';

const mockRouterWithParams = ({ query, ...rest } = {}) => {
  const useRouter = jest.spyOn(require('next/router'), 'useRouter');

  const push = jest.fn();

  const mockRouter = {
    pathname: '/',
    query: {
      ...(query ?? {}),
    },
    asPath: '/',
    push,
    prefetch: jest.fn().mockResolvedValue(undefined),
    ...rest,
  };

  useRouter.mockImplementation(() => mockRouter);
  return mockRouter;
};

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

export { mockResponses,setupPage };
