import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import { Box } from '../components/publiq-ui/Box';

const Fallback = () => {
  const router = useRouter();
  const [cookies] = useCookies(['token']);
  const [legacyPath, setLegacyPath] = useState('');

  useEffect(() => {
    if (!cookies.token) {
      router.push('/login/');
    }

    const queryString = new URLSearchParams({
      ...router.query,
      jwt: cookies.token,
      lang: i18next.language,
    }).toString();

    const path = router.asPath ? router.asPath : '';
    const parsedQueryString = queryString ? `?${queryString}` : '';
    setLegacyPath(
      `${process.env.NEXT_PUBLIC_LEGACY_APP_URL}${path}${parsedQueryString}`,
    );
  }, []);

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
