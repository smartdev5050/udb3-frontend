import PropTypes from 'prop-types';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { Box } from '@/ui/Box';
import { useCookiesWithOptions } from '@/hooks/useCookiesWithOptions';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';
import { memo, useMemo } from 'react';
import { generatePath, matchPath } from 'react-router';
import { getRedirects } from '../../redirects';

const prefixWhenNotEmpty = (value, prefix) =>
  value ? `${prefix}${value}` : value;

const IFrame = memo(({ url }) => (
  <Box
    tabIndex={0}
    as="iframe"
    src={url}
    width="100%"
    height="100vh"
    flex={1}
  />
));

IFrame.propTypes = {
  url: PropTypes.string,
};

const Fallback = () => {
  const router = useRouter();

  const {
    // eslint-disable-next-line no-unused-vars
    query: { params = [], ...queryWithoutParams },
    asPath,
  } = router;

  const { publicRuntimeConfig } = getConfig();

  const redirects = getRedirects(publicRuntimeConfig.environment);
  redirects.forEach(({ source, destination }) => {
    const match = matchPath(asPath, { path: source, exact: true });
    if (match) {
      const destinationPath = generatePath(destination, match.params);
      router.replace(destinationPath);
    }
  });

  const { cookies } = useCookiesWithOptions(['token', 'udb-language']);

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

  return <IFrame url={legacyPath} />;
};

export const getServerSideProps = getApplicationServerSideProps();

export default Fallback;
