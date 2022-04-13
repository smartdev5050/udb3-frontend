import { throttle } from 'lodash';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetOrganizersQuery } from '@/hooks/api/organizers';
import { Organizer } from '@/types/Organizer';
import { FormElement } from '@/ui/FormElement';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Typeahead } from '@/ui/Typeahead';

type Props = Omit<StackProps, 'onChange'> & {
  value: Organizer;
  onChange: (organizer: Organizer) => void;
};

const OrganizerPicker = ({ value, onChange, ...props }: Props) => {
  const { i18n, t } = useTranslation();

  const [organizerSearchInput, setOrganizerSearchInput] = useState('');

  const getOrganizersQuery = useGetOrganizersQuery(
    { q: organizerSearchInput },
    { enabled: !!organizerSearchInput },
  );

  const organizers = useMemo(() => {
    return getOrganizersQuery.data?.member;
  }, [getOrganizersQuery.data?.member]);

  return (
    <Stack {...getStackProps(props)}>
      <FormElement
        id="create-organizer"
        label={t('create.additionalInformation.organizer.title')}
        Component={
          <Typeahead<Organizer>
            options={organizers}
            labelKey={(organizer) => {
              if (typeof organizer.name === 'string') {
                return organizer.name;
              }

              return (
                organizer.name[i18n.language] ??
                organizer.name[organizer.mainLanguage]
              );
            }}
            selected={value ? [value] : []}
            onInputChange={throttle(setOrganizerSearchInput, 275)}
            onChange={(organizers) => onChange(organizers[0])}
            minLength={3}
          />
        }
      />
    </Stack>
  );
};

export { OrganizerPicker };
