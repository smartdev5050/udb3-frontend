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

    delete query.params;

    const queryString = new URLSearchParams({
      ...query,
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
