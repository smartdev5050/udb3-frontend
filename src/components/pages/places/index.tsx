import { Cookies } from 'react-cookie';
import { dehydrate } from 'react-query/hydration';
import type { User } from 'types/User';

import { DashboardPage } from '@/components/DashboardPage';
import { useGetPlacesByCreator } from '@/hooks/api/places';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

const Index = () => <DashboardPage defaultActiveTab="places" />;

export const getServerSideProps = getApplicationServerSideProps(
  async ({ req, cookies: rawCookies, queryClient }) => {
    const cookies = new Cookies(rawCookies);
    const user: User = cookies.get('user');

    await useGetPlacesByCreator({
      req,
      queryClient,
      creator: user,
    });

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        cookies: rawCookies,
      },
    };
  },
);

export default Index;
