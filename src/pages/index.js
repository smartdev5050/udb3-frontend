import { useTranslation } from 'react-i18next';

import Alert from '../components/publiq-ui/Alert';
import styles from './index.module.scss';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <Alert visible>{t('brand')}</Alert>
    </div>
  );
};

export default Home;
