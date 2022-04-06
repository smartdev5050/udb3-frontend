import { useGetEventByIdQuery } from '@/hooks/api/events';

const useGetEvent = ({ id, onSuccess }) => {
  const getEventByIdQuery = useGetEventByIdQuery({ id }, { onSuccess });

  // @ts-expect-error
  return getEventByIdQuery?.data;
};

export { useGetEvent };
