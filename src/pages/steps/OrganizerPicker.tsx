import debounce from 'lodash/debounce';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetOrganizersQuery } from '@/hooks/api/organizers';
import { Organizer } from '@/types/Organizer';
import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { isNewEntry, NewEntry, Typeahead } from '@/ui/Typeahead';

type Props = Omit<StackProps, 'onChange'> & {
  value: Organizer;
  onChange: (organizer: Organizer) => void;
  onAddNewOrganizer: (organizer: NewEntry) => void;
};

const OrganizerPicker = ({
  value,
  onChange,
  onAddNewOrganizer,
  ...props
}: Props) => {
  const { t } = useTranslation();

  const [addButtonHasBeenPressed, setAddButtonHasBeenPressed] = useState(false);
  const [organizerSearchInput, setOrganizerSearchInput] = useState('');

  const getOrganizersQuery = useGetOrganizersQuery(
    { q: organizerSearchInput },
    { enabled: !!organizerSearchInput },
  );

  const organizers = useMemo(() => {
    // @ts-expect-error
    return getOrganizersQuery.data?.member;
    // @ts-expect-error
  }, [getOrganizersQuery.data?.member]);

  return (
    <Stack {...getStackProps(props)}>
      <FormElement
        id="create-organizer"
        label={t('create.additionalInformation.organizer.title')}
        Component={
          !addButtonHasBeenPressed ? (
            <Button
              variant={ButtonVariants.SECONDARY}
              onClick={() => setAddButtonHasBeenPressed(true)}
            >
              Organisatie toevoegen
            </Button>
          ) : (
            <Typeahead<Organizer>
              options={organizers}
              labelKey={`name.${i18n.language}`}
              selected={value ? [value] : []}
              onInputChange={debounce(setOrganizerSearchInput, 275)}
              onChange={(organizers) => {
                const organizer = organizers[0];

                if (isNewEntry(organizer)) {
                  onAddNewOrganizer(organizer);
                  queryClient.invalidateQueries('organizers');
                  return;
                }

                onChange(organizer);
              }}
              minLength={3}
              newSelectionPrefix={t(
                'create.additionalInformation.organizer.add_new',
              )}
              allowNew
            />
          )
        }
      />
    </Stack>
  );
};

export { OrganizerPicker };
