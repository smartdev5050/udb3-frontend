import { useRouter } from 'next/router';
import { getApplicationServerSideProps } from '../../../utils/getApplicationServerSideProps';
import { useChangeStatus, useGetPlaceById } from '../../../hooks/api/places';
import { dehydrate } from 'react-query/hydration';
import { StatusFormOnPage } from '../../../components/offerStatus/StatusFormOnPage';
import { QueryStatus } from '../../../hooks/api/authenticated-query';
import { Spinner } from '@/ui/Spinner';

const Status = () => {
  const router = useRouter();
  const { placeId } = router.query;

  const getPlaceByIdQuery = useGetPlaceById({ id: placeId });

  if (getPlaceByIdQuery.status === QueryStatus.LOADING) {
    return <Spinner marginTop={4} />;
  }
  return (
    <StatusFormOnPage
      offer={getPlaceByIdQuery.data}
      error={getPlaceByIdQuery.error}
      useChangeStatus={useChangeStatus}
    />
  );
};

export const getServerSideProps = getApplicationServerSideProps(
  async ({ req, query, cookies, queryClient }) => {
    const { placeId } = query;
    await useGetPlaceById({ req, queryClient, id: placeId });

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        cookies,
      },
    };
  },
);

export default Status;
