import { mapValues } from 'lodash';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

import { OfferType } from '@/constants/OfferType';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import type { Values } from '@/types/Values';
import { parseSpacing } from '@/ui/Box';
import { Icon, Icons } from '@/ui/Icon';
import { getInlineProps, Inline, InlineProps } from '@/ui/Inline';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Tabs } from '@/ui/Tabs';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

import { AudienceStep } from '../AudienceStep';
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
  scope?: OfferType;
  onSuccessfulChange: (
    data?: any,
  ) => typeof data extends any ? void : Promise<void>;
  onValidationChange?: (status: ValidationStatus) => void;
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
    field: Fields.ORGANIZER,
    TabContent: OrganizerStep,
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
    shouldInvalidate: false,
    shouldShowOn: [
      AdditionalInformationStepVariant.EVENT,
      AdditionalInformationStepVariant.PLACE,
      AdditionalInformationStepVariant.MOVIE,
    ],
  },
  {
    field: Fields.AUDIENCE,
    TabContent: AudienceStep,
    shouldInvalidate: true,
    shouldShowOn: [
      AdditionalInformationStepVariant.EVENT,
      AdditionalInformationStepVariant.MOVIE,
    ],
  },
];

type TabTitleProps = InlineProps & {
  field: Field;
  validationStatus: ValidationStatus;
};

const TabTitle = ({ field, validationStatus, ...props }: TabTitleProps) => {
  const { t } = useTranslation();

  return (
    <Inline spacing={3} {...getInlineProps(props)}>
      {validationStatus === ValidationStatus.SUCCESS && (
        <Icon name={Icons.CHECK_CIRCLE} color={getGlobalValue('successIcon')} />
      )}
      {validationStatus === ValidationStatus.WARNING && (
        <Icon
          name={Icons.EXCLAMATION_CIRCLE}
          color={getGlobalValue('warningIcon')}
        />
      )}
      <Text>{t(`create.additionalInformation.${field}.title`)}</Text>
    </Inline>
  );
};

type Props = StackProps & {
  offerId: string;
  scope: OfferType;
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
  const containerRef = useRef(null);
  const entry = useIntersectionObserver(containerRef, {});
  const isVisible = !!entry?.isIntersecting;

  const queryClient = useQueryClient();

  const invalidateOfferQuery = useCallback(
    async (field: Field, shouldInvalidate: boolean) => {
      if (shouldInvalidate) {
        await queryClient.invalidateQueries([scope, { id: offerId }]);
      }
      onChangeSuccess(field);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scope, offerId, queryClient],
  );

  const [tab, setTab] = useState('description');

  const [, hash] = asPath.split('#');

  const handleScroll = () => {
    if (!containerRef.current) return;

    // no scroll to when it's already visible on the screen
    if (isVisible) {
      return;
    }

    containerRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  useEffect(() => {
    if (!hash || !Object.values(Fields).some((field) => hash === field)) return;
    setTab(hash);
    handleScroll();
  }, [hash]);

  const handleSelectTab = (tab: string) => {
    router.push({ hash: tab }, undefined, { shallow: true });
  };

  const [validatedFields, setValidatedFields] = useState<
    Record<Field, ValidationStatus>
  >({
    description: ValidationStatus.NONE,
    audience: ValidationStatus.NONE,
    contact_info: ValidationStatus.NONE,
    media: ValidationStatus.NONE,
    organizer: ValidationStatus.NONE,
    price_info: ValidationStatus.NONE,
    booking_info: ValidationStatus.NONE,
    contact_point: ValidationStatus.NONE,
  });

  return (
    <Stack ref={containerRef} {...getStackProps(props)}>
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
                    validationStatus={validatedFields[field]}
                  />
                }
              >
                <TabContent
                  minHeight="450px"
                  offerId={offerId}
                  scope={scope}
                  onValidationChange={(status) => {
                    if (validatedFields[field] === status) return;

                    setValidatedFields((prevFields) => ({
                      ...prevFields,
                      [field]: status as ValidationStatus,
                    }));
                  }}
                  onSuccessfulChange={() =>
                    invalidateOfferQuery(field, shouldInvalidate)
                  }
                  {...stepProps}
                />
              </Tabs.Tab>
            );
          },
        )}
      </Tabs>
      <OfferScore
        offerId={offerId}
        scope={scope}
        completedFields={mapValues(
          validatedFields,
          (value) => value === ValidationStatus.SUCCESS,
        )}
      />
    </Stack>
  );
};

const additionalInformationStepConfiguration: StepsConfiguration = {
  Component: AdditionalInformationStep,
  title: ({ t, scope }) => t(`create.additionalInformation.title.${scope}`),
  variant: AdditionalInformationStepVariant.EVENT,
};

export const ValidationStatus = {
  NONE: 'none',
  WARNING: 'warning',
  SUCCESS: 'success',
} as const;

export type ValidationStatus = Values<typeof ValidationStatus>;

export type { Field, TabContentProps };

export {
  additionalInformationStepConfiguration,
  AdditionalInformationStepVariant,
};
