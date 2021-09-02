import { useRouter } from 'next/router';
import { dehydrate } from 'react-query/hydration';

import { AvailabilityPageSingle } from '@/components/AvailabilityPageSingle';
import { StatusPageMultiple } from '@/components/StatusPageMultiple';
import { CalendarType } from '@/constants/CalendarType';
import { QueryStatus } from '@/hooks/api/authenticated-query';
import { useChangeStatus, useGetEventById } from '@/hooks/api/events';
import { Spinner } from '@/ui/Spinner';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

const Availability = () => {
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
    <AvailabilityPageSingle
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

export default Availability;
