import { useRouter } from 'next/router';
import { useGetEventById } from '../../../hooks/api/events';
import { EventStatus } from '../../../components/EventStatus';
import { QueryStatus } from '../../../hooks/api/authenticated-query';

const Status = () => {
  const router = useRouter();
  const { eventId } = router.query;
  const { data: event = {}, status } = useGetEventById({ id: eventId });

  return <EventStatus offer={event} loading={status === QueryStatus.LOADING} />;
};

export default Status;
