import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import {
  useAddBookingInfoMutation,
  useAddContactPointMutation,
} from '@/hooks/api/events';
import { Button, ButtonVariants } from '@/ui/Button';
import { CheckboxWithLabel } from '@/ui/CheckboxWithLabel';
import { FormElement } from '@/ui/FormElement';
import { Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { Select } from '@/ui/Select';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { Title } from '@/ui/Title';

import { MergedInfo } from './AdditionalInformationStep';

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

type BookingInfo = {
  email?: string;
  phone?: string;
  url?: string;
  urlLabel: {
    de: string;
    en: string;
    fr: string;
    nl: string;
  };
};

const getValue = getValueFromTheme('contactInformation');

const EMAIL_REGEX: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const isValidEmail = (value: any): boolean => {
  return EMAIL_REGEX.test(value);
};

const Form = ({
  type,
  contactAndBookingInfo,
  bookingInfo,
  contactInfo,
  onAddInfo,
  onAddBookingInfo,
}: {
  type: string;
  contactAndBookingInfo: ContactInfo;
  contactInfo: ContactInfo;
  bookingInfo?: BookingInfo;
  onAddInfo: (newContactInfo, onSuccess) => Promise<void>;
  onAddBookingInfo: (newBookingInfo, onSuccess) => Promise<void>;
}) => {
  const { t } = useTranslation();

  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddBookingInfo = async (value: string) => {
    // TODO add bookingInfo
    console.log('handle booking info', value);

    const newBookingInfo = bookingInfo;
    newBookingInfo[type] = value;

    await onAddBookingInfo(newBookingInfo, () => {
      console.log('success');
    });
  };

  const handleAddInfo = async () => {
    if (type === ContactInfoType.EMAIL && !isValidEmail(value)) {
      setErrorMessage(
        t('create.additionalInformation.contact_info.email_error'),
      );
      return;
    }

    setErrorMessage('');
    const newContactInfo = contactInfo;
    newContactInfo[type].push(value);
    await onAddInfo(newContactInfo, () => setValue(''));
  };

  const label = t(`create.additionalInformation.contact_info.${type}`);
  return (
    <Stack spacing={3} marginBottom={3}>
      <Title marginBottom={2}>{label}</Title>
      <Inline spacing={5} justifyContent="space-between">
        <FormElement
          flex={2}
          id={`name-${type}`}
          Component={
            <Input
              value={value}
              placeholder={t(
                'create.additionalInformation.contact_info.add_input_placeholder',
                { type: label.toLowerCase() },
              )}
              isInvalid={!!errorMessage}
              onChange={(e) => setValue(e.target.value)}
            />
          }
        />
        <Button
          iconName={Icons.PLUS}
          variant={ButtonVariants.SUCCESS}
          onClick={handleAddInfo}
        />
      </Inline>
      {errorMessage && (
        <Text color={getValue('errorText')}>{errorMessage}</Text>
      )}
      {contactAndBookingInfo[type].map((info: string, index) => {
        if (!info) return null;

        const isChecked = bookingInfo[type] === info;
        console.log({ info });
        console.log('bookingInfo type', bookingInfo[type]);
        console.log({ isChecked });

        return (
          <Stack
            key={info}
            css={
              index !== 0
                ? css`border-top: 1px solid ${getValue('borderColor')}}`
                : ''
            }
          >
            <Inline
              paddingTop={2}
              paddingBottom={2}
              spacing={5}
              justifyContent="space-between"
            >
              <Text flex={2}>{info}</Text>
              {type !== ContactInfoType.URL && (
                <CheckboxWithLabel
                  id="contact-info-reservation"
                  name="contact-info-reservation"
                  className="booking-info-reservation"
                  checked={bookingInfo[type] === info}
                  disabled={false}
                  onToggle={() => handleAddBookingInfo(info)}
                >
                  Gebruik voor reservatie
                </CheckboxWithLabel>
              )}
              <Button iconName={Icons.TRASH} variant={ButtonVariants.DANGER} />
            </Inline>
          </Stack>
        );
      })}
      {bookingInfo && type === ContactInfoType.URL && (
        <Stack>
          <Select>
            <option>Kies je reservatie website</option>
            {contactAndBookingInfo[type].map((contactInfo, key) => (
              <option key={key} value={contactInfo}>
                {contactInfo}
              </option>
            ))}
          </Select>
        </Stack>
      )}
    </Stack>
  );
};

type Props = {
  eventId: string;
  onAddContactInfoSuccess: () => Promise<void>;
  onAddBookingInfoSuccess: (field: string) => Promise<void>;
  contactInfo: ContactInfo;
  bookingInfo?: BookingInfo;
  mergedInfo: MergedInfo;
  withReservationInfo?: boolean;
};

const ContactInfoEntry = ({
  eventId,
  contactInfo,
  bookingInfo,
  mergedInfo,
  withReservationInfo = false,
  onAddContactInfoSuccess,
  onAddBookingInfoSuccess,
  ...props
}: Props) => {
  const { t } = useTranslation();

  const addContactPointMutation = useAddContactPointMutation({
    onSuccess: async () => {
      await onAddContactInfoSuccess();
    },
  });

  const handleAddContactInfoMutation = async (
    newContactInfo,
    onSuccessCallback,
  ) => {
    await addContactPointMutation.mutateAsync({
      eventId,
      contactPoint: newContactInfo,
    });
    onSuccessCallback();
  };

  const addBookingInfoMutation = useAddBookingInfoMutation({
    onSuccess: async () => {
      await onAddBookingInfoSuccess('bookingInfo');
    },
  });

  const handleAddBookingInfoMutation = async (
    newBookingInfo,
    onSuccessCallback,
  ) => {
    await addBookingInfoMutation.mutateAsync({
      eventId,
      bookingInfo: newBookingInfo,
    });
    console.log('finish mutation');
    onSuccessCallback();
  };

  return (
    <Stack {...getStackProps(props)}>
      {mergedInfo &&
        Object.keys(mergedInfo).map((type, index) => {
          return (
            <Form
              contactAndBookingInfo={mergedInfo}
              key={type}
              type={type}
              bookingInfo={bookingInfo}
              contactInfo={contactInfo}
              onAddInfo={handleAddContactInfoMutation}
              onAddBookingInfo={handleAddBookingInfoMutation}
            />
          );
        })}
    </Stack>
  );
};

export { ContactInfoEntry };
