import debounce from 'lodash/debounce';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

import { useGetOrganizersByQueryQuery } from '@/hooks/api/organizers';
import { SupportedLanguages } from '@/i18n/index';
import { Organizer } from '@/types/Organizer';
import { Values } from '@/types/Values';
import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { isNewEntry, NewEntry, Typeahead } from '@/ui/Typeahead';
import { parseOfferId } from '@/utils/parseOfferId';
import { valueToArray } from '@/utils/valueToArray';

const getValueFromGlobalTheme = getValueFromTheme('global');

type Props = Omit<StackProps, 'onChange'> & {
  organizer: Organizer;
  onChange: (organizerId: string) => void;
  onAddNewOrganizer: (organizer: NewEntry) => void;
  onDeleteOrganizer: (organizerId: string) => void;
};

const getOrganizerName = (org: Organizer, language: string) =>
  (typeof org.name === 'string' ? org.name : org.name[language]) ??
  org.name[org.mainLanguage];

const OrganizerPicker = ({
  organizer,
  onChange,
  onAddNewOrganizer,
  onDeleteOrganizer,
  ...props
}: Props) => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  const [addButtonHasBeenPressed, setAddButtonHasBeenPressed] = useState(false);
  const [organizerSearchInput, setOrganizerSearchInput] = useState('');

  const getOrganizersByQueryQuery = useGetOrganizersByQueryQuery(
    { q: organizerSearchInput },
    { enabled: !!organizerSearchInput },
  );

  const organizers = useMemo(() => {
    // @ts-expect-error
    return getOrganizersByQueryQuery.data?.member ?? [];
    // @ts-expect-error
  }, [getOrganizersByQueryQuery.data?.member]);

  return (
    <Stack {...getStackProps(props)}>
      <FormElement
        id="create-organizer"
        label={t('create.additionalInformation.organizer.title')}
        Component={
          organizer ? (
            <Inline
              justifyContent="space-between"
              alignItems="center"
              paddingY={3}
              spacing={3}
            >
              <Icon
                name={Icons.CHECK_CIRCLE}
                color={getValueFromGlobalTheme('successIcon')}
              />
              <Text>
                {getOrganizerName(
                  organizer,
                  i18n.language as Values<typeof SupportedLanguages>,
                )}
              </Text>
              <Button
                spacing={3}
                variant={ButtonVariants.LINK}
                onClick={() =>
                  onDeleteOrganizer(parseOfferId(organizer['@id']))
                }
              >
                {t('create.additionalInformation.organizer.change')}
              </Button>
            </Inline>
          ) : !addButtonHasBeenPressed ? (
            <Button
              variant={ButtonVariants.SECONDARY}
              onClick={() => setAddButtonHasBeenPressed(true)}
            >
              {t('create.additionalInformation.organizer.add_new_button')}
            </Button>
          ) : (
            <Typeahead<Organizer>
              options={organizers}
              labelKey={(org) => getOrganizerName(org, i18n.language)}
              selected={valueToArray(organizer)}
              onInputChange={debounce(setOrganizerSearchInput, 275)}
              onChange={(organizers) => {
                const organizer = organizers[0];

                if (isNewEntry(organizer)) {
                  onAddNewOrganizer(organizer);
                  queryClient.invalidateQueries('organizers');
                  return;
                }

                onChange(parseOfferId(organizer['@id']));
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
