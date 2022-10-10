import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  useAddContactPointMutation,
  useGetEventByIdQuery,
} from '@/hooks/api/events';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

import { TabContentProps } from './AdditionalInformationStep';

type ContactInfo = {
  email: string[];
  phone: string[];
  url: string[];
};

const emptyContactInfo: ContactInfo = {
  email: [],
  url: [],
  phone: [],
};

const getValue = getValueFromTheme('contactInformation');

const EMAIL_REGEX: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const URL_REGEX: RegExp = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
const PHONE_REGEX: RegExp = /^[0-9\/_.+ ]*$/;

const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};
const isValidUrl = (url: string): boolean => {
  return URL_REGEX.test(url);
};
const isValidPhone = (phone: string): boolean => {
  return PHONE_REGEX.test(phone);
};

type Props = StackProps &
  TabContentProps & {
    isOrganizer?: boolean;
    organizerContactInfo: ContactInfo;
  };

const ContactInfoStep = ({
  eventId,
  onSuccessfulChange,
  onChangeCompleted,
  organizerContactInfo,
  isOrganizer,
  ...props
}: Props) => {
  const getEventByIdQuery = useGetEventByIdQuery({ id: eventId });

  const contactInfo =
    // @ts-expect-error
    getEventByIdQuery.data?.contactPoint ?? organizerContactInfo;

  return (
    <Stack maxWidth="40rem" {...getStackProps(props)}>
      <Text>ContactInfoStep</Text>
    </Stack>
  );
};

ContactInfoStep.defaultProps = {
  isOrganizer: false,
};

export { ContactInfoStep, emptyContactInfo };
export type { ContactInfo };
