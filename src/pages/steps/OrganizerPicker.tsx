import debounce from 'lodash/debounce';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

import { useGetOrganizersQuery } from '@/hooks/api/organizers';
import { SupportedLanguages } from '@/i18n/index';
import { Organizer } from '@/types/Organizer';
import { Values } from '@/types/Values';
import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { isNewEntry, NewEntry, Typeahead } from '@/ui/Typeahead';
import { valueToArray } from '@/utils/valueToArray';

type Props = Omit<StackProps, 'onChange'> & {
  value: Organizer;
  onChange: (organizer: Organizer) => void;
  onAddNewOrganizer: (organizer: NewEntry) => void;
};

const getLabelKey = (language: Values<typeof SupportedLanguages>) => {
  return (org: Organizer) =>
    (typeof org.name === 'string' ? org.name : org.name[language]) ??
    org.name[org.mainLanguage];
};

const OrganizerPicker = ({
  value,
  onChange,
  onAddNewOrganizer,
  ...props
}: Props) => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  const [addButtonHasBeenPressed, setAddButtonHasBeenPressed] = useState(false);
  const [organizerSearchInput, setOrganizerSearchInput] = useState('');

  const getOrganizersQuery = useGetOrganizersQuery(
    { q: organizerSearchInput },
    { enabled: !!organizerSearchInput },
  );

  const organizers = useMemo(() => {
    // @ts-expect-error
    return getOrganizersQuery.data?.member ?? [];
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
              {t('create.additionalInformation.organizer.add_new_button')}
            </Button>
          ) : (
            <Typeahead<Organizer>
              options={organizers}
              labelKey={getLabelKey(
                i18n.language as Values<typeof SupportedLanguages>,
              )}
              selected={valueToArray(value)}
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
              maxWidth="30rem"
              minLength={3}
              newSelectionPrefix={t(
                'create.additionalInformation.organizer.add_new_label',
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
