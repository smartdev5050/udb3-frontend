import getConfig from 'next/config';
import { useRouter } from 'next/router';
import i18next from 'i18next';
import { Box } from '../components/publiq-ui/Box';
import { useCookiesWithOptions } from '../hooks/useCookiesWithOptions';
import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getApplicationServerSideProps } from '../utils/getApplicationServerSideProps';

const IFrame = memo(({ url }) => (
  <Box as="iframe" src={url} width="100%" height="100vh" />
));

IFrame.propTypes = {
  url: PropTypes.string,
};

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
        lang: i18next.language,
      }),
      '?',
    );

    return `${publicRuntimeConfig.legacyAppUrl}${path}${queryString}`;
  }, [asPath, cookies.token, i18next.language]);

  return <IFrame url={legacyPath} />;
};

export const getServerSideProps = getApplicationServerSideProps();

export default Fallback;
