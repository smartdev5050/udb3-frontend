import { Text } from '../../../components/publiq-ui/Text';
import { useRouter } from 'next/router';

const Status = () => {
  const router = useRouter();
  const { placeId } = router.query;
  return <Text>EventStatus place {placeId}</Text>;
};

export default Status;
