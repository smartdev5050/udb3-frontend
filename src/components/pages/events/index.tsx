import { Cookies } from 'react-cookie';
import { dehydrate } from 'react-query/hydration';
import type { User } from 'types/User';

import { DashboardPage, itemsPerPage } from '@/components/DashboardPage';
import { useGetEventsByCreator } from '@/hooks/api/events';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

type Props = {
  page?: number;
};

const Index = ({ page }: Props) => (
  <DashboardPage activeTab="events" page={page} />
);

export const getServerSideProps = getApplicationServerSideProps(
  async ({ req, query, cookies: rawCookies, queryClient }) => {
    const cookies = new Cookies(rawCookies);
    const user: User = cookies.get('user');

    await useGetEventsByCreator({
      req,
      queryClient,
      creator: user,
      paginationOptions: {
        limit: itemsPerPage,
        start: query.page ? parseInt(query.page) - 1 : 1,
      },
    });

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        cookies: rawCookies,
        page: parseInt(query.page),
      },
    };
  },
);

export default Index;
