import { EventStatus } from '../../../components/EventStatus';
import { useRouter } from 'next/router';
import { useGetPlaceById } from '../../../hooks/api/places';
import { QueryStatus } from '../../../hooks/api/authenticated-query';

const Status = () => {
  const router = useRouter();
  const { placeId } = router.query;
  const { data: place = {}, status } = useGetPlaceById({ id: placeId });
  return <EventStatus offer={place} loading={status === QueryStatus.LOADING} />;
};

export default Status;
