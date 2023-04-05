import { uniq } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';

import { useGetLabelsByQuery } from '@/hooks/api/labels';
import {
  useAddOfferLabelMutation,
  useGetOfferByIdQuery,
  useRemoveOfferLabelMutation,
} from '@/hooks/api/offers';
import { ValidationStatus } from '@/pages/steps/AdditionalInformationStep/AdditionalInformationStep';
import { Label, Offer } from '@/types/Offer';
import { Badge, BadgeVariants } from '@/ui/Badge';
import { FormElement } from '@/ui/FormElement';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { getGlobalBorderRadius } from '@/ui/theme';
import { Typeahead } from '@/ui/Typeahead';

function LabelsStep({ offerId, scope, onValidationChange, ...props }) {
  const getOfferByIdQuery = useGetOfferByIdQuery({ id: offerId, scope });
  const offer: Offer | undefined = getOfferByIdQuery.data;

  const ref = useRef(null);
  const labelsQuery = useGetLabelsByQuery({ query: '' });
  const options: Label[] = labelsQuery.data?.member ?? [];
  const [labels, setLabels] = useState<string[]>(offer.labels);
  const addLabelMutation = useAddOfferLabelMutation();
  const removeLabelMutation = useRemoveOfferLabelMutation();

  useEffect(() => {
    onValidationChange(
      labels.length ? ValidationStatus.SUCCESS : ValidationStatus.NONE,
    );
  }, [labels, onValidationChange]);

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
            onChange={async (newLabels: Label[]) => {
              await addLabelMutation.mutate({
                id: offerId,
                scope,
                label: newLabels[0].name,
              });

              setLabels(
                uniq([...labels, ...newLabels.map((label) => label.name)]),
              );

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
          <Badge
            key={label}
            variant={BadgeVariants.SECONDARY}
            borderRadius={getGlobalBorderRadius}
            cursor={'pointer'}
            display={'flex'}
          >
            {label}
            <Icon
              name={Icons.TIMES}
              width={'12px'}
              height={'12px'}
              marginLeft={1}
              onClick={async () => {
                await removeLabelMutation.mutate({
                  id: offerId,
                  scope,
                  label,
                });

                setLabels(
                  labels.filter((existingLabel) => label !== existingLabel),
                );
              }}
            />
          </Badge>
        ))}
      </Inline>
    </Stack>
  );
}

export { LabelsStep };
