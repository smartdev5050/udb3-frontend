import getConfig from 'next/config';
import { useRouter } from 'next/router';
import i18next from 'i18next';
import { Box } from '../components/publiq-ui/Box';
import { useCookiesWithOptions } from '../hooks/useCookiesWithOptions';
import { getApplicationServerSideProps } from '../utils/getApplicationServerSideProps';
import { useMemo } from 'react';

const prefixWhenNotEmpty = (value, prefix) =>
  value ? `${prefix}${value}` : value;

const Fallback = () => {
  const {
    // eslint-disable-next-line no-unused-vars
    query: { params = [], ...queryWithoutParams },
    asPath,
  } = useRouter();
  const { publicRuntimeConfig } = getConfig();

  const { cookies } = useCookiesWithOptions(['token']);

  const legacyPath = useMemo(() => {
    const path = new URL(`http://localhost${asPath}`).pathname;

    const queryString = prefixWhenNotEmpty(
      new URLSearchParams({
        ...queryWithoutParams,
        jwt: cookies.token,
        lang: cookies['udb-language'],
      }),
      '?',
    );

    return `${publicRuntimeConfig.legacyAppUrl}${path}${queryString}`;
  }, [asPath, cookies.token, cookies['udb-language']]);

  return (
    <Box as="iframe" src={legacyPath} width="100%" height="100vh" flex={1} />
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export default Fallback;
