import Alert from '../components/publiq-ui/Alert';
import styles from './index.module.scss';

const Home = () => {
  return (
    <div className={styles.container}>
      <Alert visible>Welcome to Udb3 React</Alert>
    </div>
  );
};

export default Home;
