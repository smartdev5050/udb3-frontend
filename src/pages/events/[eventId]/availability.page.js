import { useRouter } from 'next/router';
import { dehydrate } from 'react-query/hydration';

import { CalendarType } from '@/constants/CalendarType';
import { QueryStatus } from '@/hooks/api/authenticated-query';
import {
  useChangeStatusMutation,
  useChangeStatusSubEventsMutation,
  useGetEventByIdQuery,
} from '@/hooks/api/events';
import { AvailabilityPageMultiple } from '@/pages/AvailabilityPageMultiple';
import { AvailabilityPageSingle } from '@/pages/AvailabilityPageSingle';
import { Spinner } from '@/ui/Spinner';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

const Availability = () => {
  const router = useRouter();
  const { eventId } = router.query;

  const getEventByIdQuery = useGetEventByIdQuery({ id: eventId });

  const event = getEventByIdQuery.data;

  if (getEventByIdQuery.status === QueryStatus.LOADING) {
    return <Spinner marginTop={4} />;
  }

  if (event.calendarType === CalendarType.MULTIPLE)
    return (
      <AvailabilityPageMultiple
        event={event}
        refetchEvent={getEventByIdQuery.refetch}
      />
    );

  return (
    <AvailabilityPageSingle
      offer={event}
      error={getEventByIdQuery.error}
      useChangeStatusMutation={
        event.calendarType === CalendarType.SINGLE
          ? useChangeStatusSubEventsMutation
          : useChangeStatusMutation
      }
    />
  );
};

export const getServerSideProps = getApplicationServerSideProps(
  async ({ req, query, cookies, queryClient }) => {
    const { eventId } = query;
    await useGetEventByIdQuery({ req, queryClient, id: eventId });

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        cookies,
      },
    };
  },
);

export default Availability;
