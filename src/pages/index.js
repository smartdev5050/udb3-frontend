import { useTranslation } from 'react-i18next';

import { Alert, AlertVariants } from '../components/publiq-ui/Alert';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Alert visible variant={AlertVariants.DANGER}>
        {t('brand')}
      </Alert>
    </div>
  );
};

export default Home;
