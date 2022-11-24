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

type NewContactInfo = {
  type: string;
  value: string;
};

const EMAIL_REGEX: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const URL_REGEX: RegExp = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
const PHONE_REGEX: RegExp = /^[0-9\/_.+ ]*$/;

const isValidEmail = (email: string) => {
  return EMAIL_REGEX.test(email);
};
const isValidUrl = (url: string) => {
  return URL_REGEX.test(url);
};
const isValidPhone = (phone: string) => {
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

  const [contactInfoState, setContactInfoState] = useState<NewContactInfo[]>(
    [],
  );
  const [isFieldFocused, setIsFieldFocused] = useState(false);

  const contactInfo =
    // @ts-expect-error
    getEventByIdQuery.data?.contactPoint ?? organizerContactInfo;

  useEffect(() => {
    if (!contactInfo) return;

    onChangeCompleted(true);

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
  }, [contactInfo, setContactInfoState, onChangeCompleted]);

  const addContactPointMutation = useAddContactPointMutation({
    onSuccess: onSuccessfulChange,
  });

  const parseNewContactInfo = (newContactInfo: NewContactInfo[]) => {
    const [email, phone, url] = Object.values(
      ContactInfoTypes,
    ).map((infoType) =>
      newContactInfo
        .filter((info) => info.type === infoType)
        .map((info) => info.value),
    );

    return { email, phone, url };
  };

  const handleAddContactInfoMutation = async (
    newContactInfo: NewContactInfo[],
  ) => {
    await addContactPointMutation.mutateAsync({
      eventId,
      contactPoint: parseNewContactInfo(newContactInfo),
    });
  };

  const handleAddOrganizerContactInfo = (newContactInfo: NewContactInfo[]) => {
    // @ts-ignore
    const contactInfo = parseNewContactInfo(newContactInfo);
    onSuccessfulChange(contactInfo);
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

    if (newValue === '') return;

    if (isOrganizer) {
      handleAddOrganizerContactInfo(newContactInfo);
      return;
    }

    await handleAddContactInfoMutation(newContactInfo);
  };

  const handleAddNewContactInfo = () => {
    const newContactInfo = [...contactInfoState];
    newContactInfo.push({ type: ContactInfoTypes.EMAIL, value: '' });
    setContactInfoState(newContactInfo);
  };

  const handleDeleteContactInfo = async (index: number) => {
    const newContactInfo = [...contactInfoState];
    newContactInfo.splice(index, 1);

    setContactInfoState(newContactInfo);

    if (isOrganizer) {
      handleAddOrganizerContactInfo(newContactInfo);
      return;
    }

    await handleAddContactInfoMutation(newContactInfo);
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
      {(contactInfoState ?? []).map((info, index) => {
        return (
          <Inline key={index} spacing={3}>
            <Select
              width="30%"
              onChange={(e) => handleChangeContactInfoType(e, index)}
            >
              {Object.values(ContactInfoTypes).map((type) => (
                <option value={type} selected={info.type === type} key={type}>
                  {t(`create.additionalInformation.contact_info.${type}`)}
                </option>
              ))}
            </Select>
            <FormElement
              width="55%"
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
          {contactInfoState.length === 0
            ? t('create.additionalInformation.contact_info.add_more_singular')
            : t('create.additionalInformation.contact_info.add_more_multiple')}
        </Button>
      </Inline>
    </Stack>
  );
};

ContactInfoStep.defaultProps = {
  isOrganizer: false,
};

export { ContactInfoStep, isValidEmail, isValidPhone, isValidUrl };
export type { ContactInfo };
