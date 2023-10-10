import { dehydrate } from 'react-query/hydration';

import { useGetOrganizerByIdQuery } from '@/hooks/api/organizers';
import { Organizer } from '@/types/Organizer';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

import { OrganizerForm } from '../../create/OrganizerForm';

export const getServerSideProps = getApplicationServerSideProps(
  async ({ req, query, queryClient, cookies }) => {
    const { organizerId } = query;

    const organizer = (await useGetOrganizerByIdQuery({
      id: organizerId,
      req,
      queryClient,
    })) as Organizer;

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        cookies,
      },
    };
  },
);

export default OrganizerForm;
