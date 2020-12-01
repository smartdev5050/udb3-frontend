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
  const [legacyPath, setLegacyPath] = useState('');

  useEffect(() => {
    if (!window || asPath === '/[...params]') {
      return;
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
    setLegacyPath(
      `${process.env.NEXT_PUBLIC_LEGACY_APP_URL}${path}${parsedQueryString}`,
    );
  }, [asPath]);

  if (!legacyPath) return null;

  return <Box as="iframe" src={legacyPath} width="100%" height="100vh" />;
};

export default Fallback;
