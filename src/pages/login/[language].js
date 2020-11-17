import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { LoginButton } from '../../components/LoginButton';
import { Box } from '../../components/publiq-ui/Box';

const cookieOptions = {
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
};

const Index = () => {
  const router = useRouter();
  const [, setCookie] = useCookies(['udb-language']);

  const { language } = router.query;

  useEffect(() => {
    if (!language) {
      return;
    }
    if (['nl', 'fr'].includes(language)) {
      setCookie('udb-language', language, cookieOptions);
    } else {
      router.push('/login/nl');
    }
  }, [language]);

  return (
    <Box>
      <LoginButton />
    </Box>
  );
};

export default Index;
