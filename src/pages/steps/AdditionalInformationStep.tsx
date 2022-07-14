import { ReactNode, useCallback, useMemo, useState } from 'react';
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
  eventKey: string;
  title: string;
  Component: ReactNode;
  isVisible: boolean;
  isCompleted: boolean;
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

  const tabsConfigurations = useMemo<TabConfig[]>(() => {
    return [
      {
        eventKey: 'description',
        title: t('create.additionalInformation.description.title'),
        Component: (
          <DescriptionStep
            eventId={eventId}
            completed={isDescriptionCompleted}
            onChangeCompleted={(isCompleted) =>
              setIsDescriptionCompleted(isCompleted)
            }
            onSuccessfulChange={() => invalidateEventQuery('description')}
          />
        ),
        isVisible: true,
        isCompleted: isDescriptionCompleted,
      },
      {
        eventKey: 'organizer',
        title: t('create.additionalInformation.organizer.title'),
        Component: (
          <OrganizerStep
            eventId={eventId}
            completed={isOrganizerStepCompleted}
            onChangeCompleted={(isCompleted) =>
              setIsOrganizerStepCompleted(isCompleted)
            }
            onSuccessfulChange={() => invalidateEventQuery('organizer')}
          />
        ),
        isVisible: variant === AdditionalInformationStepVariant.EXTENDED,
        isCompleted: isOrganizerStepCompleted,
      },
      {
        eventKey: 'priceInfo',
        title: t('create.additionalInformation.price_info.title'),
        Component: (
          <PriceInformation
            eventId={eventId}
            completed={isPriceInformationCompleted}
            onChangeCompleted={(isCompleted) =>
              setIsPriceInformationCompleted(isCompleted)
            }
            onSuccessfulChange={() => invalidateEventQuery('priceInfo')}
          />
        ),
        isVisible: variant === AdditionalInformationStepVariant.EXTENDED,
        isCompleted: isPriceInformationCompleted,
      },
      {
        eventKey: 'contactInfo',
        title: t('create.additionalInformation.contact_info.title'),
        Component: (
          <ContactInfo
            eventContactInfo={eventContactInfo}
            eventBookingInfo={eventBookingInfo}
          />
        ),
        isVisible: variant === AdditionalInformationStepVariant.EXTENDED,
        isCompleted: false,
      },
      {
        eventKey: 'imagesAndVideos',
        title: t('create.additionalInformation.pictures_and_videos.title'),
        Component: (
          <MediaStep
            eventId={eventId}
            onChangeImageSuccess={() => invalidateEventQuery('image')}
            onChangeVideoSuccess={() => invalidateEventQuery('video')}
            onChangeCompleted={(isCompleted: boolean) =>
              setIsMediaStepCompleted(isCompleted)
            }
          />
        ),
        isVisible: true,
        isCompleted: isMediaStepCompleted,
      },
      {
        eventKey: 'audience',
        title: t('create.additionalInformation.audience.title'),
        Component: (
          <Audience
            eventId={eventId}
            onChangeSuccess={() => invalidateEventQuery('audience')}
            onChangeCompleted={(isCompleted) =>
              setIsAudienceTypeCompleted(isCompleted)
            }
          />
        ),
        isVisible: variant === AdditionalInformationStepVariant.EXTENDED,
        isCompleted: isAudienceTypeCompleted,
      },
    ];
  }, [
    eventBookingInfo,
    eventContactInfo,
    eventId,
    invalidateEventQuery,
    isDescriptionCompleted,
    isOrganizerStepCompleted,
    isAudienceTypeCompleted,
    isPriceInformationCompleted,
    isMediaStepCompleted,
    t,
    variant,
  ]);

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
          ({ eventKey, title, Component, isVisible, isCompleted }) =>
            isVisible && (
              <Tabs.Tab
                key={eventKey}
                eventKey={eventKey}
                title={<TabTitle title={title} isCompleted={isCompleted} />}
              >
                {Component}
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
