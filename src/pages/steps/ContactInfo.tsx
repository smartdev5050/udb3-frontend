import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

const getValue = getValueFromTheme('contactInformation');
const borderColorFromTheme = getValue('borderColor');
const iconColorFromTheme = getValue('iconColor');

const ContactInfoType = {
  PHONE: 'phone',
  EMAIL: 'email',
  URL: 'url',
} as const;

type ContactPoint = {
  phone: string[];
  email: string[];
  url: string[];
};

type UrlLabelInLanguages = Partial<{
  nl: string;
  fr: string;
  de: string;
  en: string;
}>;

type BookingInfo = {
  urlLabel?: UrlLabelInLanguages;
} & { [Property in keyof ContactPoint]?: string };

type Props = {
  eventId: string;
  eventContactInfo: ContactPoint;
  eventBookingInfo: BookingInfo;
};

const ContactInfo = ({
  eventId,
  eventContactInfo,
  eventBookingInfo,
}: Props) => {
  const { t } = useTranslation();

  const mergedContactAndBookingInfo = useMemo(() => {
    if (!eventContactInfo && !eventBookingInfo) {
      return { email: [], url: [], phone: [] };
    }
    return {
      email: [...eventContactInfo['email'], eventBookingInfo['email']],
      url: [...eventContactInfo['url'], eventBookingInfo['url']],
      phone: [...eventContactInfo['phone'], eventBookingInfo['phone']],
    };
  }, [eventContactInfo, eventBookingInfo]);

  const isUsedForReservation = (contactInfo: string) => {
    return Object.values(eventBookingInfo).some((item) => item === contactInfo);
  };

  return (
    <Stack>
      <Inline spacing={3} marginBottom={3}>
        <Text fontWeight="bold">
          {t('create.additionalInformation.contact_info.title')}
        </Text>
      </Inline>
      {eventContactInfo && (
        <Stack
          spacing={3}
          css={`
            border: 1px solid ${borderColorFromTheme};
          `}
        >
          {Object.keys(mergedContactAndBookingInfo).map((key, index) => {
            const contactInfoTypeLabel = t(
              `create.additionalInformation.contact_info.${key}`,
            );
            return (
              <Inline padding={3} key={index} spacing={5}>
                <Stack flex={1}>
                  <Text fontWeight="bold">{contactInfoTypeLabel}</Text>
                  <Stack>
                    {mergedContactAndBookingInfo[key].length === 0 && (
                      <Text variant={TextVariants.MUTED}>
                        {t('create.additionalInformation.contact_info.empty', {
                          contactInfoType: contactInfoTypeLabel.toLowerCase(),
                        })}
                      </Text>
                    )}
                    {mergedContactAndBookingInfo[key].map(
                      (contactInfo, index) => {
                        return (
                          <Stack
                            key={index}
                            css={
                              index !== 0
                                ? css`border-top: 1px solid ${borderColorFromTheme}}`
                                : ''
                            }
                          >
                            <Inline spacing={3} alignItems="center">
                              <Text
                                key={index}
                                paddingTop={2}
                                paddingBottom={2}
                              >
                                {contactInfo}
                              </Text>
                              {isUsedForReservation(contactInfo) && (
                                <Icon
                                  name={Icons.TICKET}
                                  color={iconColorFromTheme}
                                />
                              )}
                            </Inline>
                          </Stack>
                        );
                      },
                    )}
                  </Stack>
                </Stack>
              </Inline>
            );
          })}
          <Inline
            justifyContent="space-between"
            padding={3}
            css={`
              border-top: 1px solid ${borderColorFromTheme};
            `}
          >
            <Inline spacing={3} alignItems="center">
              <Icon name={Icons.TICKET} color={iconColorFromTheme} />
              <Text fontSize="0.9rem" variant={TextVariants.MUTED}>
                {t(
                  'create.additionalInformation.contact_info.is_used_for_reservation',
                )}
              </Text>
            </Inline>
            <Button variant={ButtonVariants.SECONDARY}>
              {t('create.additionalInformation.contact_info.edit_cta')}
            </Button>
          </Inline>
        </Stack>
      )}
    </Stack>
  );
};

export { ContactInfo };
