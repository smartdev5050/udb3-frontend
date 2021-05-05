import { DashboardPage } from '@/components/DashboardPage';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

const Index = () => <DashboardPage activeTab="events" />;

export const getServerSideProps = getApplicationServerSideProps();

export default Index;
