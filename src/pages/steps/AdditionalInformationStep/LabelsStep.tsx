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
import { Alert } from '@/ui/Alert';
import { Badge, BadgeVariants } from '@/ui/Badge';
import { FormElement } from '@/ui/FormElement';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { getGlobalBorderRadius } from '@/ui/theme';
import { Typeahead } from '@/ui/Typeahead';

type LabelsStepProps = StackProps & TabContentProps;

const LABEL_PATTERN = /^[0-9a-zA-ZÀ-ÿ][0-9a-zA-ZÀ-ÿ\-_\s]{1,49}$/;

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
  const labelsQuery: UseQueryResult<{ member: Label[] }> = useGetLabelsByQuery({
    query,
  });

  const options = labelsQuery.data?.member ?? [];
  const [labels, setLabels] = useState<string[]>(offer.labels ?? []);
  const addLabelMutation = useAddOfferLabelMutation();
  const removeLabelMutation = useRemoveOfferLabelMutation();

  useEffect(() => {
    onValidationChange(
      labels.length ? ValidationStatus.SUCCESS : ValidationStatus.NONE,
    );
  }, [labels, onValidationChange]);

  const isWriting = addLabelMutation.isLoading || removeLabelMutation.isLoading;
  const [isInvalid, setIsInvalid] = useState(false);
  return (
    <Inline width={isInvalid ? '100%' : '50%'} spacing={5}>
      <Stack
        flex={1}
        {...getStackProps(props)}
        opacity={isWriting ? 0.5 : 1}
        spacing={2}
      >
        <FormElement
          id={'labels'}
          label={t('create.additionalInformation.labels.label')}
          loading={isWriting}
          error={
            isInvalid
              ? t('create.additionalInformation.labels.error')
              : undefined
          }
          Component={
            <Typeahead
              ref={ref}
              name={'labels'}
              isInvalid={isInvalid}
              isLoading={labelsQuery.isLoading}
              options={options}
              labelKey={'name'}
              allowNew
              newSelectionPrefix={t(
                'create.additionalInformation.labels.add_new_label',
              )}
              onSearch={setQuery}
              onChange={async (newLabels: Label[]) => {
                const label = newLabels[0]?.name;
                if (!label || !label.match(LABEL_PATTERN)) {
                  return setIsInvalid(true);
                }

                setIsInvalid(false);
                await addLabelMutation.mutateAsync({
                  id: offerId,
                  scope,
                  label,
                });

                setLabels(uniq([...labels, label]));
                ref.current.clear();
              }}
              customFilter={() => true}
            />
          }
          maxWidth={'100%'}
          info={
            <Text variant={TextVariants.MUTED}>
              {t('create.additionalInformation.labels.info')}
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
      {isInvalid && (
        <Alert>{t('create.additionalInformation.labels.tips')}</Alert>
      )}
    </Inline>
  );
}

export { LabelsStep };
