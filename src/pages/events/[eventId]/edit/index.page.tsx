import { dehydrate } from 'react-query/hydration';

import { useGetEventByIdQuery } from '@/hooks/api/events';
import { Event } from '@/types/Event';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

import { OfferForm } from '../../../create/OfferForm';

export const getServerSideProps = getApplicationServerSideProps(
  async ({ req, query, queryClient }) => {
    const { eventId } = query;

    const event = (await useGetEventByIdQuery({
      id: eventId,
      req,
      queryClient,
    })) as Event;

    if (!event?.location?.['@id']) {
      return {
        redirect: {
          destination: `/event/${eventId}/migrate?location=true`,

          permanent: false,
        },
      };
    }

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  },
);

export default OfferForm;
