import { createToken } from '../utils/createToken';

const mockRouterWithParams = ({ query, ...rest } = {}) => {
  const useRouter = jest.spyOn(require('next/router'), 'useRouter');

  const push = jest.fn();

  const mockRouter = {
    pathname: '/',
    query: {
      jwt: createToken(),
      ...(query ?? {}),
    },
    asPath: '/',
    push,
    ...rest,
  };

  useRouter.mockImplementation(() => mockRouter);
  return mockRouter;
};

export { mockRouterWithParams };
