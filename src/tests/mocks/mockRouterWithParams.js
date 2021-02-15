const mockRouterWithParams = (params = {}) => {
  const useRouter = jest.spyOn(require('next/router'), 'useRouter');
  useRouter.mockImplementation(() => ({
    route: '',
    pathname: '',
    query: '',
    asPath: '',
    push: jest.fn(),
    ...params,
  }));
};

export { mockRouterWithParams };
