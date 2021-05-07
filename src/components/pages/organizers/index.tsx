import { Cookies } from 'react-cookie';
import { dehydrate } from 'react-query/hydration';
import type { User } from 'types/User';

import { DashboardPage } from '@/components/DashboardPage';
import { useGetEventsByCreator } from '@/hooks/api/events';
import { useGetOrganizersByCreator } from '@/hooks/api/organizers';
import { useGetPlacesByCreator } from '@/hooks/api/places';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

const Index = () => <DashboardPage activeTab="organizers" />;

export const getServerSideProps = getApplicationServerSideProps(
  async ({ req, cookies: rawCookies, queryClient }) => {
    const cookies = new Cookies(rawCookies);
    const user: User = cookies.get('user');

    await useGetEventsByCreator({
      req,
      queryClient,
      creator: { id: user?.id, email: user?.email },
    });

    await useGetPlacesByCreator({
      req,
      queryClient,
      creator: { id: user?.id, email: user?.email },
    });

    await useGetOrganizersByCreator({
      req,
      queryClient,
      creator: { id: user?.id, email: user?.email },
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
