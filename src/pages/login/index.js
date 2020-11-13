import i18next from 'i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const locale = i18next.language.split('-')[0];
    router.push(`/login/${locale}`);
  }, []);

  return <div />;
};

export default Index;
