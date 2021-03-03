import { useRouter } from 'next/router';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';
import { useChangeStatus, useGetEventById } from '@/hooks/api/events';
import { dehydrate } from 'react-query/hydration';
import { Spinner } from '@/ui/Spinner';
import { QueryStatus } from '@/hooks/api/authenticated-query';
import { StatusPageNotMultiple } from '@/components/StatusPageNotMultiple';
import { CalendarType } from '@/constants/CalendarType';
import { StatusPageMultiple } from '@/components/StatusPageMultiple';

const Status = () => {
  const router = useRouter();
  const { eventId } = router.query;

  const getEventByIdQuery = useGetEventById({ id: eventId });

  const event = getEventByIdQuery.data;

  if (getEventByIdQuery.status === QueryStatus.LOADING) {
    return <Spinner marginTop={4} />;
  }

  if (event.calendarType === CalendarType.MULTIPLE)
    return (
      <StatusPageMultiple
        event={event}
        refetchEvent={getEventByIdQuery.refetch}
      />
    );

  return (
    <StatusPageNotMultiple
      offer={event}
      error={getEventByIdQuery.error}
      useChangeStatus={useChangeStatus}
    />
  );
};

export const getServerSideProps = getApplicationServerSideProps(
  async ({ req, query, cookies, queryClient }) => {
    const { eventId } = query;
    await useGetEventById({ req, queryClient, id: eventId });

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        cookies,
      },
    };
  },
);

export default Status;
