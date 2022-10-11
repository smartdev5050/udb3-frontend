import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  useAddContactPointMutation,
  useGetEventByIdQuery,
} from '@/hooks/api/events';
import { Button, ButtonVariants } from '@/ui/Button';
import { Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { Select } from '@/ui/Select';
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

  const [contactInfoState, setContactInfoState] = useState({
    email: [],
    url: [],
    phone: [],
  });

  const contactInfo =
    // @ts-expect-error
    getEventByIdQuery.data?.contactPoint ?? organizerContactInfo;

  console.log({ contactInfo });

  useEffect(() => {
    if (!contactInfo) return;

    setContactInfoState(contactInfo);
  }, [contactInfo, setContactInfoState]);

  const addContactPointMutation = useAddContactPointMutation({
    onSuccess: onSuccessfulChange,
  });

  const handleAddContactInfoMutation = async (newContactInfo: ContactInfo) => {
    await addContactPointMutation.mutateAsync({
      eventId,
      contactPoint: newContactInfo,
    });
  };

  const handleChangeValue = async (
    event: FormEvent<HTMLInputElement>,
    infoType: string,
    key: number,
  ) => {
    const newValue = (event.target as HTMLInputElement).value;

    const newContactInfo = { ...contactInfoState };
    newContactInfo[infoType][key] = newValue;

    await handleAddContactInfoMutation(newContactInfo);
  };

  const handleAddNewContactInfo = () => {
    const newContactInfo = { ...contactInfoState };
    contactInfoState['phone'].push('');
    setContactInfoState(newContactInfo);
  };

  const handleDeleteContactInfo = async (key: string, index: number) => {
    const newContactInfo = { ...contactInfoState };
    const isEmptyString = newContactInfo[key][index] === '';

    delete newContactInfo[key][index];
    setContactInfoState(newContactInfo);

    if (!isEmptyString) {
      await handleAddContactInfoMutation(newContactInfo);
    }
  };

  return (
    <Stack maxWidth="40rem" {...getStackProps(props)} spacing={3}>
      <Text fontWeight="bold">ContactInfoStep</Text>
      {contactInfoState &&
        Object.keys(contactInfoState).map((key) => {
          return contactInfoState[key].map((info, index) => (
            <Inline key={index} spacing={3}>
              <Select width="40%">
                {Object.keys(contactInfoState).map((contactInfoKey) => (
                  <option
                    selected={key === contactInfoKey}
                    key={contactInfoKey}
                  >
                    {contactInfoKey}
                  </option>
                ))}
              </Select>
              <Input
                value={info}
                onChange={(e) => {
                  const newContactInfoState = { ...contactInfo };
                  newContactInfoState[key][index] = e.target.value;
                  setContactInfoState(newContactInfoState);
                }}
                onBlur={(e) => handleChangeValue(e, key, index)}
              />
              <Button
                onClick={() => handleDeleteContactInfo(key, index)}
                variant={ButtonVariants.DANGER}
                iconName={Icons.TRASH}
              ></Button>
            </Inline>
          ));
        })}
      <Inline>
        <Button
          onClick={handleAddNewContactInfo}
          variant={ButtonVariants.SECONDARY}
        >
          Meer contactgegevens toevoegen
        </Button>
      </Inline>
    </Stack>
  );
};

ContactInfoStep.defaultProps = {
  isOrganizer: false,
};

export { ContactInfoStep, emptyContactInfo };
export type { ContactInfo };
