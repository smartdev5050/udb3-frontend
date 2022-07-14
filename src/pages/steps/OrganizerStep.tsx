import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  useAddOrganizerToEventMutation,
  useDeleteOrganizerFromEventMutation,
  useGetEventByIdQuery,
} from '@/hooks/api/events';
import { useCreateOrganizerMutation } from '@/hooks/api/organizers';
import { Stack } from '@/ui/Stack';
import { parseOfferId } from '@/utils/parseOfferId';

import { OrganizerAddModal, OrganizerData } from '../OrganizerAddModal';
import { OrganizerPicker } from './OrganizerPicker';

type Props = {
  eventId?: string;
  onChangeCompleted: (completed: boolean) => void;
  onSuccessfulChange: () => void;
};

const OrganizerStep = ({
  eventId,
  onChangeCompleted,
  onSuccessfulChange,
  ...props
}: Props) => {
  const { i18n } = useTranslation();

  const getEventByIdQuery = useGetEventByIdQuery({ id: eventId });

  // @ts-expect-error
  const organizer = getEventByIdQuery.data?.organizer;

  const [isOrganizerAddModalVisible, setIsOrganizerAddModalVisible] = useState(
    false,
  );
  const [newOrganizerName, setNewOrganizerName] = useState('');
  const [organizerId, setOrganizerId] = useState('');

  useEffect(() => {
    if (!organizer) return;

    const organizerId = parseOfferId(organizer['@id']);

    setOrganizerId(organizerId);

    onChangeCompleted(true);
  }, [organizer, onChangeCompleted]);

  const createOrganizerMutation = useCreateOrganizerMutation();

  const addOrganizerToEventMutation = useAddOrganizerToEventMutation({
    onSuccess: onSuccessfulChange,
  });

  const deleteOrganizerFromEventMutation = useDeleteOrganizerFromEventMutation({
    onSuccess: onSuccessfulChange,
  });

  const handleChangeOrganizer = () => {
    addOrganizerToEventMutation.mutate({ eventId, organizerId });
  };

  const handleAddOrganizer = async ({ url, name, address }: OrganizerData) => {
    const payload = {
      mainLanguage: i18n.language,
      url,
      name: {
        [i18n.language]: name,
      },
      address: {
        [i18n.language]: {
          addressCountry: address.country,
          addressLocality: address.city.name,
          postalCode: address.city.zip,
          streetAddress: address.streetAndNumber,
        },
      },
    };
    const { organizerId } = await createOrganizerMutation.mutateAsync(payload);

    await addOrganizerToEventMutation.mutateAsync({ eventId, organizerId });

    setIsOrganizerAddModalVisible(false);
  };

  return (
    <Stack {...getStackProps(props)}>
      <OrganizerAddModal
        prefillName={newOrganizerName}
        visible={isOrganizerAddModalVisible}
        onConfirm={handleAddOrganizer}
        onClose={() => setIsOrganizerAddModalVisible(false)}
      />
      <OrganizerPicker
        onChange={handleChangeOrganizer}
        onAddNewOrganizer={(newOrganizer) => {
          setNewOrganizerName(newOrganizer.label);
          setIsOrganizerAddModalVisible(true);
        }}
        onDeleteOrganizer={(organizerId) =>
          deleteOrganizerFromEventMutation.mutate({
            eventId,
            organizerId,
          })
        }
        organizer={organizer}
      />
    </Stack>
  );
};

export { OrganizerStep };
