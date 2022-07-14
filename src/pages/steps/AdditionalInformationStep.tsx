import { FC, ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

import { useGetEventByIdQuery } from '@/hooks/api/events';
import type { Values } from '@/types/Values';
import { parseSpacing } from '@/ui/Box';
import { Icon, Icons } from '@/ui/Icon';
import { getInlineProps, Inline, InlineProps } from '@/ui/Inline';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Tabs } from '@/ui/Tabs';
import { Text } from '@/ui/Text';

import { Audience } from './Audience';
import { ContactInfo } from './ContactInfo';
import { DescriptionStep } from './DescriptionStep';
import { MediaStep } from './MediaStep';
import { OrganizerStep } from './OrganizerStep';
import { PriceInformation } from './PriceInformation';

const AdditionalInformationStepVariant = {
  MINIMAL: 'minimal',
  EXTENDED: 'extended',
} as const;

type Field =
  | 'description'
  | 'image'
  | 'video'
  | 'contactInfo'
  | 'priceInfo'
  | 'audience'
  | 'organizer';

type TabConfig = {
  eventKey: Field;
  title: string;
  isVisible: boolean;
  isCompleted: boolean;
  onChangeCompleted: (value: boolean) => void;
  Component: FC<{
    eventId: string;
    onSuccessfulChange: () => Promise<void>;
    onChangeCompleted: (value: boolean) => void;
  }>;
};

type TabTitleProps = InlineProps & {
  title: string;
  isCompleted: boolean;
};

const TabTitle = ({ title, isCompleted, ...props }: TabTitleProps) => {
  return (
    <Inline spacing={3} {...getInlineProps(props)}>
      {isCompleted && <Icon name={Icons.CHECK_CIRCLE} color="#48874a" />}
      <Text>{title}</Text>
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

  const { t } = useTranslation();

  const [tab, setTab] = useState('description');

  const [isDescriptionCompleted, setIsDescriptionCompleted] = useState(false);
  const [isAudienceTypeCompleted, setIsAudienceTypeCompleted] = useState(false);
  const [
    isPriceInformationCompleted,
    setIsPriceInformationCompleted,
  ] = useState(false);

  const [isOrganizerStepCompleted, setIsOrganizerStepCompleted] = useState(
    false,
  );

  const [isMediaStepCompleted, setIsMediaStepCompleted] = useState(false);

  const getEventByIdQuery = useGetEventByIdQuery({ id: eventId });

  const eventContactInfo = useMemo(() => {
    if (variant !== AdditionalInformationStepVariant.EXTENDED) return;
    // @ts-expect-error
    return getEventByIdQuery.data?.contactPoint;
    // @ts-expect-error
  }, [getEventByIdQuery.data?.contactPoint, variant]);

  const eventBookingInfo = useMemo(() => {
    if (variant !== AdditionalInformationStepVariant.EXTENDED) return;
    // @ts-expect-error
    return getEventByIdQuery.data?.bookingInfo;
    // @ts-expect-error
  }, [getEventByIdQuery.data?.bookingInfo, variant]);

  const tabsConfigurations = useMemo<TabConfig[]>(
    () => [
      {
        eventKey: 'description',
        title: t('create.additionalInformation.description.title'),
        Component: DescriptionStep,
        isVisible: true,
        isCompleted: isDescriptionCompleted,
        onChangeCompleted: setIsDescriptionCompleted,
      },
    ],
    [isDescriptionCompleted, t],
  );

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
          ({
            eventKey,
            title,
            Component,
            isVisible,
            isCompleted,
            onChangeCompleted,
          }) =>
            isVisible && (
              <Tabs.Tab
                key={eventKey}
                eventKey={eventKey}
                title={<TabTitle title={title} isCompleted={isCompleted} />}
              >
                <Component
                  eventId={eventId}
                  onChangeCompleted={onChangeCompleted}
                  onSuccessfulChange={() => invalidateEventQuery(eventKey)}
                />
              </Tabs.Tab>
            ),
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

export {
  additionalInformationStepConfiguration,
  AdditionalInformationStepVariant,
};
