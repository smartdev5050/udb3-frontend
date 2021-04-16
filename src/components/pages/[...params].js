import PropTypes from 'prop-types';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { Box } from '@/ui/Box';
import { useCookiesWithOptions } from '@/hooks/useCookiesWithOptions';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';
import { memo, useMemo, useState } from 'react';
import { generatePath, matchPath } from 'react-router';
import { getRedirects } from '../../redirects';
import {
  useHandleWindowMessage,
  WindowMessageTypes,
} from '@/hooks/useHandleWindowMessage';
import PageNotFound from '@/pages/404';
import { useIsClient } from '@/hooks/useIsClient';
import { isFeatureFlagEnabledInCookies } from '@/hooks/useFeatureFlag';
import { Cookies } from 'react-cookie';

const prefixWhenNotEmpty = (value, prefix) =>
  value ? `${prefix}${value}` : value;

const getRedirect = (originalPath, environment, cookies) => {
  const matches = getRedirects(environment)
    .map(({ source, destination, permanent, featureFlag }) => {
      // Don't follow redirects that are behind a feature flag
      if (featureFlag) {
        const enabled = isFeatureFlagEnabledInCookies(featureFlag, cookies);
        if (!enabled) {
          return false;
        }
      }

      // Check if the redirect source matches the current path
      const match = matchPath(originalPath, { path: source, exact: true });
      if (match) {
        return {
          destination: generatePath(destination, match.params),
          permanent,
        };
      }
      return false;
    })
    .filter((match) => !!match);

  if (matches.length > 0) {
    return matches[0];
  }
  return false;
};

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

  // Keep track of which paths were not found. Do not store as a single boolean
  // for the current path, because it's possible to navigate from a 404 path to
  // another page that's handled by this same Fallback component and then the
  // boolean notFound state would not update.
  const [notFoundPaths, setNotFoundPaths] = useState([]);
  useHandleWindowMessage({
    [WindowMessageTypes.URL_UNKNOWN]: () =>
      setNotFoundPaths([asPath, ...notFoundPaths]),
  });

  const isClientSide = useIsClient();

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

  if (notFoundPaths.includes(asPath)) {
    return <PageNotFound />;
  }

  // Only render the iframe on the client-side.
  // Otherwise the iframe is already in the DOM before the
  // window.addEventListener() from useHandleWindowMessage gets registered,
  // and then the 404 logic does not get triggered because the listener is too
  // late to get the message from the AngularJS app.
  if (isClientSide) {
    return <IFrame url={legacyPath} />;
  }

  return null;
};

export const getServerSideProps = getApplicationServerSideProps(
  ({ req, query, cookies: rawCookies, queryClient }) => {
    const cookies = new Cookies(rawCookies);
    const { publicRuntimeConfig } = getConfig();
    const path = '/' + query.params.join('/');
    const redirect = getRedirect(
      path,
      publicRuntimeConfig.environment,
      cookies.cookies,
    );
    if (redirect) {
      return { redirect };
    }

    return { props: { cookies: rawCookies } };
  },
);

export default Fallback;
