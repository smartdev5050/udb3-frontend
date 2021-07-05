import Dashboard, {
  getServerSideProps as dashboardGetServerSideProps,
} from '@/pages/dashboard';

const DashboardWrapper = (props) => {
  return <Dashboard {...props} />;
};

export default DashboardWrapper;
export const getServerSideProps = dashboardGetServerSideProps;
