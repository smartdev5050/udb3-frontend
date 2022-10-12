import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  useAddContactPointMutation,
  useGetEventByIdQuery,
} from '@/hooks/api/events';
import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { Select } from '@/ui/Select';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

import { TabContentProps } from './AdditionalInformationStep';

const ContactInfoTypes = {
  EMAIL: 'email',
  PHONE: 'phone',
  URL: 'url',
} as const;

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

const isValidInfo = (type: string, value: string): boolean => {
  if (value === '') return true;
  if (type === 'email') return isValidEmail(value);
  if (type === 'url') return isValidUrl(value);
  if (type === 'phone') return isValidPhone(value);
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
  const { t } = useTranslation();

  const getEventByIdQuery = useGetEventByIdQuery({ id: eventId });

  const [contactInfoState, setContactInfoState] = useState([]);
  const [isFieldFocused, setIsFieldFocused] = useState(false);

  const contactInfo =
    // @ts-expect-error
    getEventByIdQuery.data?.contactPoint ?? organizerContactInfo;

  console.log({ contactInfo });

  useEffect(() => {
    if (!contactInfo) return;

    const contactInfoArray = [];
    Object.keys(contactInfo).forEach((key) => {
      contactInfo[key].forEach((item) => {
        contactInfoArray.push({
          type: key,
          value: item,
        });
      });
    });

    setContactInfoState(contactInfoArray);
  }, [contactInfo, setContactInfoState]);

  const addContactPointMutation = useAddContactPointMutation({
    onSuccess: () => onSuccessfulChange(false),
    enabled: false,
  });

  const handleAddContactInfoMutation = async (newContactInfo) => {
    const email =
      newContactInfo
        .filter((info) => info.type === 'email')
        .map((info) => info.value) ?? [];

    const phone =
      newContactInfo
        .filter((info) => info.type === 'phone' && info.value)
        .map((info) => info.value) ?? [];

    const url =
      newContactInfo
        .filter((info) => info.type === 'url' && info.value)
        .map((info) => info.value) ?? [];

    await addContactPointMutation.mutateAsync({
      eventId,
      contactPoint: {
        email,
        phone,
        url,
      },
    });
  };

  const handleChangeValue = async (
    event: FormEvent<HTMLInputElement>,
    index: number,
  ) => {
    const newValue = (event.target as HTMLInputElement).value;
    const infoType = contactInfoState[index].type;

    if (!isValidInfo(infoType, newValue)) return;

    const newContactInfo = [...contactInfoState];
    newContactInfo[index].value = newValue;

    if (newValue !== '') {
      await handleAddContactInfoMutation(newContactInfo);
    }
  };

  const handleAddNewContactInfo = () => {
    const newContactInfo = [...contactInfoState];
    newContactInfo.push({ type: 'email', value: '' });
    setContactInfoState(newContactInfo);
  };

  const handleDeleteContactInfo = async (index: number) => {
    const isEmptyString = contactInfoState[index].value === '';

    const newContactInfo = [...contactInfoState];
    newContactInfo.splice(index, 1);

    setContactInfoState(newContactInfo);

    if (!isEmptyString) {
      await handleAddContactInfoMutation(newContactInfo);
    }
  };

  const handleChangeContactInfoType = async (
    event: ChangeEvent<HTMLSelectElement>,
    index: number,
  ) => {
    const newType = event.target.value;
    const newContactInfo = [...contactInfoState];
    newContactInfo[index].type = newType;

    setContactInfoState(newContactInfo);

    if (newContactInfo[index].value !== '') {
      await handleAddContactInfoMutation(newContactInfo);
    }
  };

  return (
    <Stack maxWidth="40rem" {...getStackProps(props)} spacing={3}>
      <Text fontWeight="bold">ContactInfoStep</Text>
      {contactInfoState &&
        contactInfoState.map((info, index) => {
          return (
            <Inline key={index} spacing={3}>
              <Select
                width="40%"
                onChange={(e) => {
                  handleChangeContactInfoType(e, index);
                }}
              >
                {Object.values(ContactInfoTypes).map((type) => (
                  <option selected={info.type === type} key={type}>
                    {type}
                  </option>
                ))}
              </Select>
              <FormElement
                Component={
                  <Input
                    value={info.value}
                    onChange={(e) => {
                      const newContactInfoState = [...contactInfoState];
                      newContactInfoState[index].value = e.target.value;
                      setContactInfoState(newContactInfoState);
                      setIsFieldFocused(true);
                    }}
                    onBlur={(e) => {
                      setIsFieldFocused(false);
                      handleChangeValue(e, index);
                    }}
                  />
                }
                id="contact-info-value"
                error={
                  !isFieldFocused &&
                  !isValidInfo(info.type, info.value) &&
                  t(
                    `create.additionalInformation.contact_info.${info.type}_error`,
                  )
                }
              />

              <Button
                onClick={() => handleDeleteContactInfo(index)}
                variant={ButtonVariants.DANGER}
                iconName={Icons.TRASH}
              ></Button>
            </Inline>
          );
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
