import { useRouter } from 'next/router';
import { useGetEventById } from '../../../hooks/api/events';
import { EventStatus } from '../../../components/EventStatus';
import { QueryStatus } from '../../../hooks/api/authenticated-query';
import { useState } from 'react';

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
    <EventStatus
      offer={event}
      loading={status === QueryStatus.LOADING}
      errorMessage={errorMessage}
    />
  );
};

export default Status;
