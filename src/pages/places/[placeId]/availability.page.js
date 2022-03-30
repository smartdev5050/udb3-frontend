import { useRouter } from 'next/router';
import { dehydrate } from 'react-query/hydration';

import { QueryStatus } from '@/hooks/api/authenticated-query';
import {
  useChangeStatusMutation,
  useGetPlaceByIdQuery,
} from '@/hooks/api/places';
import { AvailabilityPageSingle } from '@/pages/AvailabilityPageSingle';
import { Spinner } from '@/ui/Spinner';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

const Availability = () => {
  const router = useRouter();
  const { placeId } = router.query;

  const getPlaceByIdQuery = useGetPlaceByIdQuery({ id: placeId });

  if (getPlaceByIdQuery.status === QueryStatus.LOADING) {
    return <Spinner marginTop={4} />;
  }
  return (
    <AvailabilityPageSingle
      offer={getPlaceByIdQuery.data}
      error={getPlaceByIdQuery.error}
      useChangeStatusMutation={useChangeStatusMutation}
    />
  );
};

export const getServerSideProps = getApplicationServerSideProps(
  async ({ req, query, cookies, queryClient }) => {
    const { placeId } = query;
    await useGetPlaceByIdQuery({ req, queryClient, id: placeId });

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        cookies,
      },
    };
  },
);

export default Availability;
