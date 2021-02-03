import { OfferStatus } from '../../../components/OfferStatus';
import { useRouter } from 'next/router';
import { useGetPlaceById } from '../../../hooks/api/places';
import { QueryStatus } from '../../../hooks/api/authenticated-query';
import { useState } from 'react';
import { getApplicationServerSideProps } from '../../../utils/getApplicationServerSideProps';

const Status = () => {
  const router = useRouter();
  const { placeId } = router.query;
  const [errorMessage, setErrorMessage] = useState();
  const handleError = (error) => {
    setErrorMessage(error.message);
  };
  const { data: place = {}, status } = useGetPlaceById(
    { id: placeId },
    { onError: handleError },
  );
  return (
    <OfferStatus
      offer={place}
      loading={status === QueryStatus.LOADING}
      errorMessage={errorMessage}
    />
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export default Status;
