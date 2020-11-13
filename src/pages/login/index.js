import i18next from 'i18next';
import { useRouter } from 'next/router';

const Index = () => {
  const router = useRouter();

  const locale = i18next.language.split('-')[0] || 'nl';
  router.push(`/login/${locale}`);
  return <div />;
};

export default Index;
