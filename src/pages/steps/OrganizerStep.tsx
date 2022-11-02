import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  useAddOrganizerToEventMutation,
  useDeleteOrganizerFromEventMutation,
  useGetEventByIdQuery,
} from '@/hooks/api/events';
import { useCreateOrganizerMutation } from '@/hooks/api/organizers';
import {
  CardSystem,
  useAddCardSystemToEventMutation,
  useDeleteCardSystemFromEventMutation,
  useGetCardSystemForEventQuery,
  useGetCardSystemsForOrganizerQuery,
} from '@/hooks/api/uitpas';
import { CheckboxWithLabel } from '@/ui/CheckboxWithLabel';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text } from '@/ui/Text';
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

  // @ts-ignore
  const getCardSystemForEventQuery = useGetCardSystemForEventQuery({
    id: eventId,
  });

  // @ts-expect-error
  const organizer = getEventByIdQuery.data?.organizer;

  // @ts-ignore
  const getCardSystemsForOrganizerQuery = useGetCardSystemsForOrganizerQuery({
    id: organizer?.['@id'] ? parseOfferId(organizer['@id']) : undefined,
  });

  // @ts-expect-error
  const cardSystemForEvent = getCardSystemForEventQuery.data ?? {};

  const selectedCardSystems: CardSystem[] = Object.values(cardSystemForEvent);

  // @ts-expect-error
  const cardSystems = getCardSystemsForOrganizerQuery.data ?? {};

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

  const addCardSystemToEventMutation = useAddCardSystemToEventMutation({
    onSuccess: () => {
      console.log('added success');
    },
  });

  const deleteCardSystemFromEventMutation = useDeleteCardSystemFromEventMutation(
    {
      onSuccess: () => {
        console.log('delete success');
      },
    },
  );

  const handleAddCardSystemToEvent = (cardSystemId: number) => {
    addCardSystemToEventMutation.mutate({ cardSystemId, id: eventId });
  };

  const handleDeleteCardSystemFromEvent = (cardSystemId: number) => {
    deleteCardSystemFromEventMutation.mutate({ cardSystemId, id: eventId });
  };

  const handleToggleCardSystem = (
    event: ChangeEvent<HTMLInputElement>,
    cardSystemId: number,
  ) => {
    if (event.target.checked) {
      handleAddCardSystemToEvent(cardSystemId);
      return;
    }

    handleDeleteCardSystemFromEvent(cardSystemId);
  };

  const handleChangeOrganizer = (organizerId: string) => {
    addOrganizerToEventMutation.mutate({ eventId, organizerId });
  };

  const handleAddOrganizer = async ({
    url,
    name,
    address,
    contact,
  }: OrganizerData) => {
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
      contact,
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
      {Object.values(cardSystems).length !== 0 && (
        <Stack>
          <Text fontWeight="bold">UiTPAS Kaartsystemen</Text>
          {Object.values(cardSystems).map((cardSystem: CardSystem) => (
            <CheckboxWithLabel
              className="cardsystem-checkbox"
              id={cardSystem.id}
              key={cardSystem.id}
              name={cardSystem.name}
              checked={selectedCardSystems.some(
                ({ id }) => cardSystem.id === id,
              )}
              disabled={false}
              onToggle={(e) => handleToggleCardSystem(e, cardSystem.id)}
            >
              {cardSystem.name}
            </CheckboxWithLabel>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export { OrganizerStep };
