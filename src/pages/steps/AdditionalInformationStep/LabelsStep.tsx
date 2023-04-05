import { FormElement } from '@/ui/FormElement';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { Typeahead } from '@/ui/Typeahead';
import { useGetLabelsByQuery } from '@/hooks/api/labels';
import { useState } from 'react';
import { Label } from '@/types/Offer';

function LabelsStep(props) {
  const [query, setQuery] = useState('');
  const labelsQuery = useGetLabelsByQuery({ query: '' });
  const labels: Label[] = labelsQuery.data?.member ?? [];

  return (
    <Stack {...getStackProps(props)}>
      <FormElement
        id={'labels'}
        label={'Verfijn met labels'}
        Component={
          <Typeahead
            name={'labels'}
            loading={labelsQuery.isLoading}
            options={labels}
            labelKey={'name'}
            onSearch={(query) => labelsQuery.refetch({ query })}
            customFilter={() => true}
          />
        }
        maxWidth={'50%'}
        info={
          <Text variant={TextVariants.MUTED}>
            Met labels voeg je korte, specifieke trefwoorden toe
          </Text>
        }
      />
    </Stack>
  );
}

export { LabelsStep };
