import Dashboard, {
  getServerSideProps as dashboardGetServerSideProps,
} from '@/components/pages/dashboard';
import { FeatureFlags, useFeatureFlag } from '@/hooks/useFeatureFlag';
import Fallback from '@/pages/[...params]';

const DashboardWrapper = (props) => {
  const [isReactDashboardFeatureFlagEnabled] = useFeatureFlag(
    FeatureFlags.REACT_DASHBOARD,
  );

  if (!isReactDashboardFeatureFlagEnabled) return <Fallback {...props} />;

  return <Dashboard {...props} />;
};

export default DashboardWrapper;
export const getServerSideProps = dashboardGetServerSideProps;
