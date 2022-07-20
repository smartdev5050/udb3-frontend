import { FC, useCallback, useMemo, useState } from 'react';
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
import { ContactInfoEntry } from './ContactInfoEntry';
import { DescriptionStep } from './DescriptionStep';
import { MediaStep } from './MediaStep';
import { OrganizerStep } from './OrganizerStep';
import { PriceInformation } from './PriceInformation';

const AdditionalInformationStepVariant = {
  MINIMAL: 'minimal',
  EXTENDED: 'extended',
} as const;

type MergedInfo = {
  email: string[];
  url: string[];
  phone: string[];
};

type Field =
  | 'description'
  | 'image'
  | 'video'
  | 'contactInfo'
  | 'priceInfo'
  | 'audience'
  | 'bookingInfo'
  | 'contactPoint'
  | 'organizer';

type TabConfig = {
  field: Field;
  TabContent: FC<{
    eventId: string;
    onSuccessfulChange: () => Promise<void>;
    onChangeCompleted: (value: boolean) => void;
  }>;
  shouldShowOnMinimal: boolean;
};

const tabsConfigurations: TabConfig[] = [
  {
    field: 'description',
    TabContent: DescriptionStep,
    shouldShowOnMinimal: true,
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
    async (field: Field) => {
      await queryClient.invalidateQueries(['events', { id: eventId }]);
      onChangeSuccess(field);
    },
    [eventId, onChangeSuccess, queryClient],
  );

  const [tab, setTab] = useState('description');

  const [isFieldCompleted, setIsFieldCompleted] = useState<
    Record<Field, boolean>
  >({
    description: false,
    audience: false,
    contactInfo: false,
    image: false,
    organizer: false,
    priceInfo: false,
    video: false,
    bookingInfo: false,
    contactPoint: false,
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
        {tabsConfigurations.map(
          ({ shouldShowOnMinimal, field, TabContent }) => {
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
                    isCompleted={isFieldCompleted[field]}
                  />
                }
              >
                <TabContent
                  eventId={eventId}
                  onChangeCompleted={(isCompleted) =>
                    setIsFieldCompleted((prevFields) => ({
                      ...prevFields,
                      [field]: isCompleted,
                    }))
                  }
                  onSuccessfulChange={() => invalidateEventQuery(field)}
                />
              </Tabs.Tab>
            );
          },
        )}
      </Tabs>
    </Stack>
  );
};

AdditionalInformationStep.defaultProps = {
  variant: AdditionalInformationStepVariant.EXTENDED,
};

const additionalInformationStepConfiguration = {
  Component: AdditionalInformationStep,
  title: (t) => t(`movies.create.step5.title`),
};

export type { MergedInfo };

export {
  additionalInformationStepConfiguration,
  AdditionalInformationStepVariant,
};
