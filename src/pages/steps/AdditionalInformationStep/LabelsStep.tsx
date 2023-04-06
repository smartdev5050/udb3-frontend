import { uniq } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UseQueryResult } from 'react-query';

import { useGetLabelsByQuery } from '@/hooks/api/labels';
import {
  useAddOfferLabelMutation,
  useGetOfferByIdQuery,
  useRemoveOfferLabelMutation,
} from '@/hooks/api/offers';
import {
  TabContentProps,
  ValidationStatus,
} from '@/pages/steps/AdditionalInformationStep/AdditionalInformationStep';
import { Label, Offer } from '@/types/Offer';
import { Badge, BadgeVariants } from '@/ui/Badge';
import { FormElement } from '@/ui/FormElement';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { getGlobalBorderRadius } from '@/ui/theme';
import { Typeahead } from '@/ui/Typeahead';

type LabelsStepProps = StackProps & TabContentProps;

function LabelsStep({
  offerId,
  scope,
  onValidationChange,
  ...props
}: LabelsStepProps) {
  const { t } = useTranslation();

  const getOfferByIdQuery = useGetOfferByIdQuery({ id: offerId, scope });
  // @ts-expect-error
  const offer: Offer | undefined = getOfferByIdQuery.data;

  const ref = useRef(null);

  const [query, setQuery] = useState('');
  // @ts-expect-error
  const labelsQuery: UseQueryResult<Promise<{ data: { member: Label[] } }>> =
    useGetLabelsByQuery({ query });

  // @ts-expect-error
  const options = labelsQuery.data?.member ?? [];
  const [labels, setLabels] = useState<string[]>(offer.labels);
  const addLabelMutation = useAddOfferLabelMutation();
  const removeLabelMutation = useRemoveOfferLabelMutation();

  useEffect(() => {
    onValidationChange(
      labels.length ? ValidationStatus.SUCCESS : ValidationStatus.NONE,
    );
  }, [labels, onValidationChange]);

  const isWriting = addLabelMutation.isLoading || removeLabelMutation.isLoading;

  return (
    <Stack {...getStackProps(props)} opacity={isWriting ? 0.5 : 1}>
      <FormElement
        id={'labels'}
        label={t('create.additionalInformation.labels.label')}
        loading={isWriting}
        Component={
          <Typeahead
            ref={ref}
            name={'labels'}
            isLoading={labelsQuery.isLoading}
            options={options}
            labelKey={'name'}
            allowNew
            onSearch={setQuery}
            onChange={async (newLabels: Label[]) => {
              await addLabelMutation.mutateAsync({
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
            {t('create.additionalInformation.labels.info')}
          </Text>
        }
      />
      <Inline spacing={2} marginTop={4}>
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
                await removeLabelMutation.mutateAsync({
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
