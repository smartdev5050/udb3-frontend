import { DashboardPage } from '@/components/DashboardPage';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

const Index = () => <DashboardPage activeTab="organizers" />;

export const getServerSideProps = getApplicationServerSideProps();

export default Index;
