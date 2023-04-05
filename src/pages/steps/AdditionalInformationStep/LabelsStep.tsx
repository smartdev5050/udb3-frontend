import { FormElement } from '@/ui/FormElement';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { Typeahead } from '@/ui/Typeahead';
import { useGetLabelsByQuery } from '@/hooks/api/labels';
import React, { useRef, useState } from 'react';
import { Label, Offer } from '@/types/Offer';
import { Badge, BadgeVariants } from '@/ui/Badge';
import { Inline } from '@/ui/Inline';
import { Icon, Icons } from '@/ui/Icon';
import { uniqBy } from 'lodash';
import { useGetOfferByIdQuery } from '@/hooks/api/offers';
import { getGlobalBorderRadius } from '@/ui/theme';

function LabelsStep({ offerId, scope, ...props }) {
  const getOfferByIdQuery = useGetOfferByIdQuery({ id: offerId, scope });
  const offer: Offer | undefined = getOfferByIdQuery.data;

  const ref = useRef(null);
  const labelsQuery = useGetLabelsByQuery({ query: '' });
  const options: Label[] = labelsQuery.data?.member ?? [];
  const [labels, setLabels] = useState<string[]>(offer.labels);

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
              setLabels(
                uniqBy([...labels, ...newLabels], 'uuid').map(
                  (label) => label.name,
                ),
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
              onClick={() =>
                setLabels(
                  labels.filter((existingLabel) => label !== existingLabel),
                )
              }
            />
          </Badge>
        ))}
      </Inline>
    </Stack>
  );
}

export { LabelsStep };
