import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  useAddOrganizerToEventMutation,
  useDeleteOrganizerFromEventMutation,
  useGetEventByIdQuery,
} from '@/hooks/api/events';
import { useCreateOrganizerMutation } from '@/hooks/api/organizers';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { parseOfferId } from '@/utils/parseOfferId';

import { OrganizerAddModal, OrganizerData } from '../OrganizerAddModal';
import { TabContentProps } from './AdditionalInformationStep';
import { OrganizerPicker } from './OrganizerPicker';

type Props = StackProps & TabContentProps;

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

  useEffect(() => {
    if (!organizer) {
      onChangeCompleted(false);
      return;
    }
    onChangeCompleted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizer]);

  const createOrganizerMutation = useCreateOrganizerMutation();

  const addOrganizerToEventMutation = useAddOrganizerToEventMutation({
    onSuccess: onSuccessfulChange,
  });

  const deleteOrganizerFromEventMutation = useDeleteOrganizerFromEventMutation({
    onSuccess: onSuccessfulChange,
  });

  const handleChangeOrganizer = (organizerId: string) => {
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
