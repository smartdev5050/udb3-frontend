import { useGetEventByIdQuery } from '@/hooks/api/events';

const useGetEvent = ({ id, onSuccess, enabled }) => {
  const getEventByIdQuery = useGetEventByIdQuery(
    { id },
    { onSuccess, enabled },
  );

  // @ts-expect-error
  return getEventByIdQuery?.data;
};

export { useGetEvent };
