import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import {
  useAddBookingInfoMutation,
  useAddContactPointMutation,
} from '@/hooks/api/events';
import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { LabelPositions } from '@/ui/Label';
import { RadioButtonGroup } from '@/ui/RadioButtonGroup';
import { SelectWithLabel } from '@/ui/SelectWithLabel';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
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
  urlLabel?: {
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

const URL_LABELS = [
  { label: 'Koop tickets', value: 'buy' },
  { label: 'Reserveer plaatsen', value: 'book' },
  { label: 'Controleer beschikbaarheid', value: 'availability' },
  { label: 'Schrijf je in', value: 'subscribe' },
];

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
    const newBookingInfo = { ...bookingInfo };
    newBookingInfo[type] = value;

    let newContactInfo = { ...contactInfo };
    newContactInfo[type] = contactInfo[type].filter((info) => info !== value);

    // Readd old bookingInfo as contactInfo
    if (bookingInfo[type]) {
      newContactInfo[type].push(bookingInfo[type]);
    }

    await onAddInfo(newContactInfo, () => {
      console.log('contact info verwijderd');
    });

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
    const newContactInfo = { ...contactInfo };
    newContactInfo[type].push(value);
    await onAddInfo(newContactInfo, () => setValue(''));
  };

  const handleDeleteInfo = async (value: string) => {
    if (bookingInfo[type] === value) {
      const newBookingInfo = { ...bookingInfo };
      delete newBookingInfo[type];
      await onAddBookingInfo(newBookingInfo, () =>
        console.log('removed as bookingInfo'),
      );
      return;
    }

    let newContactInfo = { ...contactInfo };
    newContactInfo[type] = newContactInfo[type].filter(
      (info) => info !== value,
    );

    await onAddInfo(newContactInfo, () => console.log('delete done'));
  };

  const label = t(`create.additionalInformation.contact_info.${type}`);
  return (
    <Stack spacing={3} marginBottom={5}>
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
                { contactInfoType: label.toLowerCase() },
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

        return (
          <Stack
            marginBottom={10}
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
              <Button
                iconName={Icons.TRASH}
                variant={ButtonVariants.DANGER}
                onClick={() => handleDeleteInfo(info)}
              />
            </Inline>
          </Stack>
        );
      })}

      <Stack spacing={4} marginTop={3}>
        <Stack>
          <SelectWithLabel
            label={t(
              'create.additionalInformation.contact_info.select_for_reservation',
              { contactInfoType: label.toLowerCase() },
            )}
            labelPosition={LabelPositions.TOP}
            onChange={(e) => handleAddBookingInfo(e.target.value)}
          >
            <option value="" disabled selected={!bookingInfo[type]}>
              {t(
                'create.additionalInformation.contact_info.select_for_reservation',
                { contactInfoType: label.toLowerCase() },
              )}
            </option>
            {contactAndBookingInfo[type].map(
              (contactInfo, key) =>
                contactInfo && (
                  <option
                    key={key}
                    value={contactInfo}
                    selected={bookingInfo[type] === contactInfo}
                  >
                    {contactInfo}
                  </option>
                ),
            )}
          </SelectWithLabel>
        </Stack>
        {type === ContactInfoType.URL && bookingInfo[type] && (
          <Stack>
            <Text fontWeight="bold">
              {t('create.additionalInformation.contact_info.select_url_label')}
            </Text>
            <RadioButtonGroup
              name="urlLabel"
              items={URL_LABELS}
              selected="buy"
              onChange={() => {
                console.log('handle change');
              }}
            />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

type Props = {
  eventId: string;
  onAddContactInfoSuccess: () => void;
  onAddBookingInfoSuccess: () => void;
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
    onSuccess: () => {
      onAddContactInfoSuccess();
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
    onSuccess: () => {
      setTimeout(() => {
        onAddBookingInfoSuccess();
      }, 1000);
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
    // onSuccessCallback();
  };

  return (
    <Stack {...getStackProps(props)}>
      {mergedInfo &&
        Object.keys(mergedInfo).map((type: string) => {
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
