import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Values } from '@/types/Values';
import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { Select } from '@/ui/Select';
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
  eventId: string;
  addContactInfoMutation: () => void;
  contactInfo: ContactInfo;
  bookingInfo?: any;
  withReservationInfo?: boolean;
};

const ContactInfoEntry = ({
  eventId,
  addContactInfoMutation,
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

  const handleAddContactInfo = (value: string, type: string): void => {
    const newContactInfo = mergedContactAndBookingInfo;

    newContactInfo[type].push(value);

    // @ts-ignore
    addContactInfoMutation.mutateAsync({
      eventId,
      contactPoint: { ...newContactInfo },
    });
  };

  const isFromContactInfo = (info: string, type: string): boolean => {
    return contactInfo[type].some((value) => info === value);
  };

  const isFromBookingInfo = (info: string, type: string): boolean => {
    return bookingInfo[type].some((value) => info === value);
  };

  const handleDeleteContactInfo = (info: string, type: string): void => {
    if (isFromContactInfo(info, type)) {
      const newContactInfo = contactInfo;
      newContactInfo[type] = newContactInfo[type].filter(
        (contactInfoForType: string) => contactInfoForType !== info,
      );

      // @ts-ignore
      addContactInfoMutation.mutateAsync({
        eventId,
        contactPoint: { ...newContactInfo },
      });
    }
  };

  return (
    <Stack {...getStackProps(props)}>
      {mergedContactAndBookingInfo &&
        Object.keys(mergedContactAndBookingInfo).map((key, index) => {
          const contactInfoType = key;
          const contactInfoTypeLabel = t(
            `create.additionalInformation.contact_info.${contactInfoType}`,
          );
          return (
            <Stack key={index} spacing={3} marginBottom={3}>
              <Title marginBottom={2}>{contactInfoTypeLabel}</Title>
              <Inline spacing={5} justifyContent="space-between">
                <FormElement
                  flex={2}
                  id={`name-${contactInfoType}`}
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
                  onClick={() => {
                    console.log('hanlde add contactPoint');
                    // handleAddContactInfo(textInput.current.value, key);
                  }}
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
                      <Text flex={2}>{info}</Text>
                      <Button
                        iconName={Icons.TRASH}
                        variant={ButtonVariants.DANGER}
                        onClick={() =>
                          handleDeleteContactInfo(info, contactInfoType)
                        }
                      />
                    </Inline>
                  )
                );
              })}
              {bookingInfo && key === ContactInfoType.URL && (
                <Stack>
                  <Select>
                    <option>Kies Je Website url</option>
                    {mergedContactAndBookingInfo[key].map((contactInfo) => (
                      <option key={key} value={contactInfo}>
                        {contactInfo}
                      </option>
                    ))}
                  </Select>
                </Stack>
              )}
            </Stack>
          );
        })}
    </Stack>
  );
};

export { ContactInfoEntry };
