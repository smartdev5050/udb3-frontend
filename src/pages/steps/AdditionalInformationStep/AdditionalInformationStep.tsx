import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

import { OfferType } from '@/constants/OfferType';
import type { Values } from '@/types/Values';
import { parseSpacing } from '@/ui/Box';
import { Icon, Icons } from '@/ui/Icon';
import { getInlineProps, Inline, InlineProps } from '@/ui/Inline';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Tabs } from '@/ui/Tabs';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

import { Audience } from '../AudienceStep';
import { StepsConfiguration } from '../Steps';
import { BookingInfoStep } from './BookingInfoStep';
import { ContactInfoStep } from './ContactInfoStep';
import { DescriptionStep } from './DescriptionStep';
import { MediaStep } from './MediaStep';
import { OfferScore } from './OfferScore';
import { OrganizerStep } from './OrganizerStep';
import { PriceInformation } from './PriceInformation';

const getGlobalValue = getValueFromTheme('global');

const AdditionalInformationStepVariant = {
  MOVIE: 'movie',
  EVENT: 'event',
  PLACE: 'place',
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
  offerId?: string;
  scope?: Values<typeof OfferType>;
  onSuccessfulChange: (() => Promise<void>) | ((data: any) => void);
  onChangeCompleted?: (value: boolean) => void;
};

type TabConfig = {
  field: Field;
  TabContent: FC<TabContentProps & { [prop: string]: unknown }>;
  shouldShowOn?: Values<typeof AdditionalInformationStepVariant>[];
  shouldInvalidate: boolean;
  stepProps?: Record<string, unknown>;
};

const tabConfigurations: TabConfig[] = [
  {
    field: Fields.DESCRIPTION,
    TabContent: DescriptionStep,
    shouldInvalidate: true,
  },
  {
    field: Fields.MEDIA,
    TabContent: MediaStep,
    shouldInvalidate: true,
  },
  {
    field: Fields.PRICE_INFO,
    TabContent: PriceInformation,
    shouldInvalidate: true,
  },
  {
    field: Fields.CONTACT_INFO,
    TabContent: ContactInfoStep,
    shouldInvalidate: false,
  },
  {
    field: Fields.BOOKING_INFO,
    TabContent: BookingInfoStep,
    shouldInvalidate: true,
  },
  {
    field: Fields.ORGANIZER,
    TabContent: OrganizerStep,
    shouldInvalidate: true,
  },
  {
    field: Fields.AUDIENCE,
    TabContent: Audience,
    shouldInvalidate: true,
    shouldShowOn: [
      AdditionalInformationStepVariant.EVENT,
      AdditionalInformationStepVariant.MOVIE,
    ],
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
      {isCompleted && (
        <Icon name={Icons.CHECK_CIRCLE} color={getGlobalValue('successIcon')} />
      )}
      <Text>{t(`create.additionalInformation.${field}.title`)}</Text>
    </Inline>
  );
};

type Props = StackProps & {
  offerId: string;
  scope: Values<typeof OfferType>;
  onChangeSuccess: (field: Field) => void;
  variant?: Values<typeof AdditionalInformationStepVariant>;
};

const AdditionalInformationStep = ({
  offerId,
  scope,
  onChangeSuccess,
  variant,
  ...props
}: Props) => {
  const { asPath, ...router } = useRouter();

  const queryClient = useQueryClient();

  const invalidateEventQuery = useCallback(
    async (field: Field, shouldInvalidate: boolean) => {
      if (shouldInvalidate) {
        await queryClient.invalidateQueries(['events', { id: offerId }]);
      }
      onChangeSuccess(field);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [offerId, queryClient],
  );

  const [tab, setTab] = useState('description');

  const [_path, hash] = asPath.split('#');

  useEffect(() => {
    if (!hash || !Object.values(Fields).some((field) => hash === field)) return;
    setTab(hash);
  }, [hash]);

  const handleSelectTab = (tab: string) => {
    router.push({ hash: tab }, undefined, { shallow: true });
  };

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
        onSelect={handleSelectTab}
        css={`
          .tab-content {
            padding-top: ${parseSpacing(3)};
          }
        `}
      >
        {tabConfigurations.map(
          ({
            shouldShowOn,
            field,
            shouldInvalidate,
            TabContent,
            stepProps,
          }) => {
            const shouldShowTab = shouldShowOn
              ? shouldShowOn.includes(variant)
              : true;

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
                  minHeight="350px"
                  offerId={offerId}
                  scope={scope}
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
      <OfferScore offerId={offerId} completedFields={completedFields} />
    </Stack>
  );
};

const additionalInformationStepConfiguration: StepsConfiguration = {
  Component: AdditionalInformationStep,
  title: ({ t }) => t(`movies.create.step5.title`),
  shouldShowStep: ({ offerId }) => !!offerId,
  variant: AdditionalInformationStepVariant.EVENT,
};

export type { Field, MergedInfo, TabContentProps };

export {
  additionalInformationStepConfiguration,
  AdditionalInformationStepVariant,
};
