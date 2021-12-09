import { dehydrate } from 'react-query/hydration';

import { useGetEventById } from '@/hooks/api/events';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

import { MoviePage } from './MoviePage';

export const getServerSideProps = getApplicationServerSideProps(
  async ({ req, query, cookies, queryClient }) => {
    const { eventId } = query;

    await useGetEventById({
      req,
      queryClient,
      id: eventId,
    });

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        cookies,
      },
    };
  },
);

export default MoviePage;
