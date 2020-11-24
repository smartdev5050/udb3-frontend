import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';

const Index = () => {
  const router = useRouter();
  const [cookies] = useCookies(['udb-language']);

  useEffect(() => {
    const languageFromCookie = cookies['udb-language'];
    if (['nl', 'fr'].includes(languageFromCookie)) {
      router.push(`login/${languageFromCookie}`);
    } else {
      router.push('/login/nl');
    }
  }, []);

  return null;
};

export default Index;
