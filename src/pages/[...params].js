import { useRouter } from 'next/router';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import { Box } from '../components/publiq-ui/Box';
import { useCookiesWithOptions } from '../hooks/useCookiesWithOptions';

const Fallback = () => {
  const {
    query: { params, ...queryWithoutParams },
    asPath,
  } = useRouter();

  const [cookies] = useCookiesWithOptions(['token']);

  if (typeof window === 'undefined' || asPath === '/[...params]') {
    return null;
  }

  const queryString = new URLSearchParams({
    ...queryWithoutParams,
    jwt: cookies.token,
    lang: i18next.language,
  }).toString();

  const path = asPath
    ? new URL(`${window.location.protocol}//${window.location.host}${asPath}`)
        .pathname
    : '';

  const parsedQueryString = queryString ? `?${queryString}` : '';

  const legacyPath = `${process.env.NEXT_PUBLIC_LEGACY_APP_URL}${path}${parsedQueryString}`;

  return <Box as="iframe" src={legacyPath} width="100%" height="100vh" />;
};

export default Fallback;
