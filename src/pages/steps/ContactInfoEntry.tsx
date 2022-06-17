import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAddContactPointMutation } from '@/hooks/api/events';
import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { Select } from '@/ui/Select';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
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

const getValue = getValueFromTheme('contactInformation');

const EMAIL_REGEX: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const isValidEmail = (value: any): boolean => {
  return EMAIL_REGEX.test(value);
};

const Form = ({
  type,
  contactAndBookingInfo,
  hasBookingInfo,
  onAddInfo,
}: {
  type: string;
  contactAndBookingInfo: ContactInfo;
  hasBookingInfo: boolean;
  onAddInfo: (newContactInfo, onSuccess) => Promise<void>;
}) => {
  const { t } = useTranslation();

  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddInfo = () => {
    if (type === ContactInfoType.EMAIL && !isValidEmail(value)) {
      setErrorMessage(
        t('create.additionalInformation.contact_info.email_error'),
      );
      return;
    }

    setErrorMessage('');
    const newContactInfo = contactAndBookingInfo;
    newContactInfo[type].push(value);
    onAddInfo(newContactInfo, () => setValue(''));
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
      {contactAndBookingInfo[type].map((info) => {
        return (
          info && (
            <Inline marginBottom={3} spacing={5} justifyContent="space-between">
              <Text flex={2}>{info}</Text>
              <Button iconName={Icons.TRASH} variant={ButtonVariants.DANGER} />
            </Inline>
          )
        );
      })}
      {hasBookingInfo && type === ContactInfoType.URL && (
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
  onAddContactInfoSuccess: () => void;
  contactInfo: ContactInfo;
  bookingInfo?: any;
  withReservationInfo?: boolean;
};

const ContactInfoEntry = ({
  eventId,
  contactInfo,
  bookingInfo,
  withReservationInfo = false,
  onAddContactInfoSuccess,
  ...props
}: Props) => {
  const { t } = useTranslation();

  const addContactPointMutation = useAddContactPointMutation({
    onSuccess: async () => {
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

  const mergedContactAndBookingInfo = useMemo(() => {
    if (!contactInfo) return;

    if (!bookingInfo) return contactInfo;

    return {
      email: [...new Set([...contactInfo['email'], bookingInfo['email']])],
      url: [...new Set([...contactInfo['url'], bookingInfo['url']])],
      phone: [...new Set([...contactInfo['phone'], bookingInfo['phone']])],
    };
  }, [contactInfo, bookingInfo]);

  return (
    <Stack {...getStackProps(props)}>
      {mergedContactAndBookingInfo &&
        Object.keys(mergedContactAndBookingInfo).map((type, index) => {
          return (
            <Form
              contactAndBookingInfo={mergedContactAndBookingInfo}
              key={type}
              type={type}
              hasBookingInfo={!!bookingInfo}
              onAddInfo={handleAddContactInfoMutation}
            />
          );
        })}
    </Stack>
  );
};

export { ContactInfoEntry };
