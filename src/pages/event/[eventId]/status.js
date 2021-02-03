import { Text } from '../../../components/publiq-ui/Text';
import { useRouter } from 'next/router';

const Status = () => {
  const router = useRouter();
  const { eventId } = router.query;
  return <Text>EventStatus event {eventId}</Text>;
};

export default Status;
