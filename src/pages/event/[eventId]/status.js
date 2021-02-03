import { useRouter } from 'next/router';
import { useGetEventById } from '../../../hooks/api/events';
import { OfferStatus } from '../../../components/OfferStatus';
import { QueryStatus } from '../../../hooks/api/authenticated-query';
import { useState } from 'react';
import { getApplicationServerSideProps } from '../../../utils/getApplicationServerSideProps';

const Status = () => {
  const router = useRouter();
  const { eventId } = router.query;
  const [errorMessage, setErrorMessage] = useState();
  const handleError = (error) => {
    setErrorMessage(error.message);
  };
  const { data: event = {}, status } = useGetEventById(
    { id: eventId },
    { onError: handleError },
  );

  return (
    <OfferStatus
      offer={event}
      loading={status === QueryStatus.LOADING}
      errorMessage={errorMessage}
    />
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export default Status;
