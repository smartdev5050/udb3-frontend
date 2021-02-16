import { createToken } from '../utils/createToken';

const mockRouterWithParams = ({ query, ...rest } = {}) => {
  const useRouter = jest.spyOn(require('next/router'), 'useRouter');
  useRouter.mockImplementation(() => ({
    pathname: '/',
    query: {
      jwt: createToken(),
      ...(query ?? {}),
    },
    asPath: '/',
    push: jest.fn(),
    ...rest,
  }));
};

export { mockRouterWithParams };
