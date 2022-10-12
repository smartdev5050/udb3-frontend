import { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

import type { Values } from '@/types/Values';
import { parseSpacing } from '@/ui/Box';
import { Icon, Icons } from '@/ui/Icon';
import { getInlineProps, Inline, InlineProps } from '@/ui/Inline';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Tabs } from '@/ui/Tabs';
import { Text } from '@/ui/Text';

import { Audience } from './Audience';
import { BookingInfoStep } from './BookingInfoStep';
import { ContactInfoStep } from './ContactInfoStep';
import { DescriptionStep } from './DescriptionStep';
import { EventScore } from './EventScore';
import { MediaStep } from './MediaStep';
import { OrganizerStep } from './OrganizerStep';
import { PriceInformation } from './PriceInformation';
import { FormDataUnion, StepsConfiguration } from './Steps';

const AdditionalInformationStepVariant = {
  MINIMAL: 'minimal',
  EXTENDED: 'extended',
} as const;

type MergedInfo = {
  email: string[];
  url: string[];
  phone: string[];
};

const Fields = {
  DESCRIPTION: 'description',
  ORGANIZER: 'organizer',
  CONTACT_INFO: 'contact_info',
  BOOKING_INFO: 'booking_info',
  PRICE_INFO: 'price_info',
  MEDIA: 'media',
  AUDIENCE: 'audience',
};

type Field = Values<typeof Fields>;

type TabContentProps = {
  eventId?: string;
  onSuccessfulChange: (() => Promise<void>) | ((data: any) => void);
  onChangeCompleted?: (value: boolean) => void;
};

type TabConfig = {
  field: Field;
  TabContent: FC<TabContentProps & { [prop: string]: unknown }>;
  shouldShowOnMinimal: boolean;
  shouldInvalidate: boolean;
  stepProps?: Record<string, unknown>;
};

const tabConfigurations: TabConfig[] = [
  {
    field: Fields.DESCRIPTION,
    TabContent: DescriptionStep,
    shouldShowOnMinimal: true,
    shouldInvalidate: true,
  },
  {
    field: Fields.MEDIA,
    TabContent: MediaStep,
    shouldShowOnMinimal: true,
    shouldInvalidate: true,
  },
  {
    field: Fields.PRICE_INFO,
    TabContent: PriceInformation,
    shouldShowOnMinimal: true,
    shouldInvalidate: true,
  },
  {
    field: Fields.CONTACT_INFO,
    TabContent: ContactInfoStep,
    shouldShowOnMinimal: true,
    shouldInvalidate: false,
  },
  {
    field: Fields.BOOKING_INFO,
    TabContent: BookingInfoStep,
    shouldShowOnMinimal: true,
  },
  {
    field: Fields.ORGANIZER,
    TabContent: OrganizerStep,
    shouldShowOnMinimal: true,
    shouldInvalidate: true,
  },
  {
    field: Fields.AUDIENCE,
    TabContent: Audience,
    shouldShowOnMinimal: true,
    shouldInvalidate: true,
  },
];

type TabTitleProps = InlineProps & {
  field: Field;
  isCompleted: boolean;
};

const TabTitle = ({ field, isCompleted, ...props }: TabTitleProps) => {
  const { t } = useTranslation();

  return (
    <Inline spacing={3} {...getInlineProps(props)}>
      {isCompleted && <Icon name={Icons.CHECK_CIRCLE} color="#48874a" />}
      <Text>{t(`create.additionalInformation.${field}.title`)}</Text>
    </Inline>
  );
};

type Props = StackProps & {
  eventId: string;
  onChangeSuccess: (field: Field) => void;
  variant?: Values<typeof AdditionalInformationStepVariant>;
};

const AdditionalInformationStep = ({
  eventId,
  onChangeSuccess,
  variant,
  ...props
}: Props) => {
  const queryClient = useQueryClient();

  const invalidateEventQuery = useCallback(
    async (field: Field, shouldInvalidate: boolean) => {
      if (shouldInvalidate) {
        await queryClient.invalidateQueries(['events', { id: eventId }]);
      }
      onChangeSuccess(field);
    },
    [eventId, onChangeSuccess, queryClient],
  );

  const [tab, setTab] = useState('description');

  const [completedFields, setCompletedFields] = useState<
    Record<Field, boolean>
  >({
    description: false,
    audience: false,
    contact_info: false,
    media: false,
    organizer: false,
    price_info: false,
    booking_info: false,
    contact_point: false,
  });

  return (
    <Stack {...getStackProps(props)}>
      <Tabs
        activeKey={tab}
        onSelect={setTab}
        css={`
          .tab-content {
            padding-top: ${parseSpacing(3)};
          }
        `}
      >
        {tabConfigurations.map(
          ({
            shouldShowOnMinimal,
            field,
            shouldInvalidate,
            TabContent,
            stepProps,
          }) => {
            const shouldShowTab =
              variant !== AdditionalInformationStepVariant.MINIMAL ||
              shouldShowOnMinimal;

            if (!shouldShowTab) return null;

            return (
              <Tabs.Tab
                key={field}
                eventKey={field}
                title={
                  <TabTitle
                    field={field}
                    isCompleted={completedFields[field]}
                  />
                }
              >
                <TabContent
                  eventId={eventId}
                  onChangeCompleted={(isCompleted) => {
                    if (completedFields[field] === isCompleted) return;

                    setCompletedFields((prevFields) => ({
                      ...prevFields,
                      [field]: isCompleted,
                    }));
                  }}
                  onSuccessfulChange={() =>
                    invalidateEventQuery(field, shouldInvalidate)
                  }
                  {...stepProps}
                />
              </Tabs.Tab>
            );
          },
        )}
      </Tabs>
      <EventScore eventId={eventId} completedFields={completedFields} />
    </Stack>
  );
};

AdditionalInformationStep.defaultProps = {
  variant: AdditionalInformationStepVariant.EXTENDED,
};

const additionalInformationStepConfiguration: StepsConfiguration<FormDataUnion> = {
  Component: AdditionalInformationStep,
  title: ({ t }) => t(`movies.create.step5.title`),
  shouldShowStep: ({ eventId }) => !!eventId,
};

export type { Field, MergedInfo, TabContentProps };

export {
  additionalInformationStepConfiguration,
  AdditionalInformationStepVariant,
};
