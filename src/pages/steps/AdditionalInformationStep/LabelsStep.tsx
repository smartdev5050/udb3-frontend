import { FormElement } from '@/ui/FormElement';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { Typeahead } from '@/ui/Typeahead';
import { useGetLabelsByQuery } from '@/hooks/api/labels';
import React, { useRef, useState } from 'react';
import { Label } from '@/types/Offer';
import { Badge, BadgeVariants } from '@/ui/Badge';
import { Inline } from '@/ui/Inline';

function LabelsStep(props) {
  const ref = useRef(null);
  const labelsQuery = useGetLabelsByQuery({ query: '' });
  const options: Label[] = labelsQuery.data?.member ?? [];
  const [labels, setLabels] = useState<Label[]>([]);

  return (
    <Stack {...getStackProps(props)}>
      <FormElement
        id={'labels'}
        label={'Verfijn met labels'}
        Component={
          <Typeahead
            ref={ref}
            name={'labels'}
            loading={labelsQuery.isLoading}
            options={options}
            labelKey={'name'}
            onSearch={(query) => labelsQuery.refetch({ query })}
            onChange={(newLabels: Label[]) => {
              setLabels([...labels, ...newLabels]);
              ref.current.clear();
            }}
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
      <Inline spacing={2}>
        {labels.map((label) => (
          <Badge key={label.uuid} variant={BadgeVariants.SECONDARY}>
            {label.name}
          </Badge>
        ))}
      </Inline>
    </Stack>
  );
}

export { LabelsStep };
