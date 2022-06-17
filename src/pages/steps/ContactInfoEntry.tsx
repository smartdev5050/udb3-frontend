import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { Title } from '@/ui/Title';

const ContactInfoType = {
  EMAIL: 'email',
  PHONE: 'phone',
  URL: 'url',
} as const;

type ContactInfo = {
  email: string[];
  phone: string[];
  url: string[];
};

type Props = {
  contactInfo: ContactInfo;
  bookingInfo?: any;
  withReservationInfo?: boolean;
};

const ContactInfoEntry = ({
  contactInfo,
  bookingInfo,
  withReservationInfo = false,
  ...props
}: Props) => {
  const { t } = useTranslation();

  const mergedContactAndBookingInfo = useMemo(() => {
    if (!bookingInfo) return contactInfo;

    return {
      email: [...new Set([...contactInfo['email'], bookingInfo['email']])],
      url: [...new Set([...contactInfo['url'], bookingInfo['url']])],
      phone: [...new Set([...contactInfo['phone'], bookingInfo['phone']])],
    };
  }, [contactInfo, bookingInfo]);

  console.log({ mergedContactAndBookingInfo });
  return (
    <Stack {...getStackProps(props)}>
      <p>ContactInfoEntry</p>
      {mergedContactAndBookingInfo &&
        Object.keys(mergedContactAndBookingInfo).map((key, index) => {
          const contactInfoTypeLabel = t(
            `create.additionalInformation.contact_info.${key}`,
          );
          return (
            <Stack key={index} spacing={3} marginBottom={3}>
              <Title marginBottom={2}>{contactInfoTypeLabel}</Title>
              <Inline spacing={5} justifyContent="space-between">
                <FormElement
                  flex={2}
                  id={`name-${key}`}
                  Component={
                    <Input
                      placeholder={t(
                        'create.additionalInformation.contact_info.add_input_placeholder',
                        { contactInfoType: contactInfoTypeLabel.toLowerCase() },
                      )}
                    />
                  }
                />
                <Button
                  iconName={Icons.PLUS}
                  variant={ButtonVariants.SUCCESS}
                />
              </Inline>
              {mergedContactAndBookingInfo[key].map((info) => {
                return (
                  info && (
                    <Inline
                      marginBottom={3}
                      spacing={5}
                      justifyContent="space-between"
                    >
                      <FormElement
                        flex={2}
                        key={key}
                        id={`name-${key}`}
                        Component={<Input placeholder="" value={info} />}
                      />
                      <Button
                        iconName={Icons.TRASH}
                        variant={ButtonVariants.DANGER}
                      />
                    </Inline>
                  )
                );
              })}
            </Stack>
          );
        })}
    </Stack>
  );
};

export { ContactInfoEntry };
