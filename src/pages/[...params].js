import { useRouter } from 'next/router';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import { Box } from '../components/publiq-ui/Box';
import { useCookiesWithOptions } from '../hooks/useCookiesWithOptions';

const Fallback = () => {
  const { query, asPath, ...router } = useRouter();
  const [cookies] = useCookiesWithOptions(['token']);
  const [legacyPath, setLegacyPath] = useState('');

  useEffect(() => {
    if (!cookies.token) {
      router.push('/login/');
    }

    /* 
    Remove the "params" query parameter added by Next 
    (which holds the current path, based on `[...params]` in the filename)
    because it causes infinite redirects as it keeps adding this query parameter to the iframe's URL 
    */
    const queryParameters = { ...query };
    delete queryParameters.params;

    const queryString = new URLSearchParams({
      ...queryParameters,
      jwt: cookies.token,
      lang: i18next.language,
    }).toString();

    const path = asPath || '';
    const parsedQueryString = queryString ? `?${queryString}` : '';
    setLegacyPath(
      `${process.env.NEXT_PUBLIC_LEGACY_APP_URL}${path}${parsedQueryString}`,
    );
  }, [asPath]);

  if (!legacyPath) return null;

  return (
    <Box
      as="iframe"
      src={legacyPath}
      css={`
        height: 100vh;
        width: 100%;
      `}
    />
  );
};

export default Fallback;
