import { Cookies } from 'react-cookie';
import { QueryClient } from 'react-query';

const getApplicationServerSideProps = (callbackFn) => async ({
  req,
  query,
}) => {
  if (process.env.NOD_ENV !== 'production') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
  }

  const { cookies } = new Cookies(req?.headers?.cookie);
  const isUnAuthorized = !cookies.token && !query?.jwt;

  if (isUnAuthorized) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const queryClient = new QueryClient();

  // TODO: prefetch user, permission, roles

  if (!callbackFn) return { props: { cookies } };
  return await callbackFn({ req, query, queryClient, cookies });
};

export { getApplicationServerSideProps };
