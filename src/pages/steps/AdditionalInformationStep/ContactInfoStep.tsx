import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { OfferTypes } from '@/constants/OfferType';
import { useGetEventByIdQuery } from '@/hooks/api/events';
import { useAddOfferContactPointMutation } from '@/hooks/api/offers';
import { useGetPlaceByIdQuery } from '@/hooks/api/places';
import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { Select } from '@/ui/Select';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { prefixUrlWithHttp } from '@/utils/url';

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
const URL_REGEX: RegExp =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
const PHONE_REGEX: RegExp = /^[0-9\/_.+ ]*$/;

const isValidEmail = (email: string) => {
  return EMAIL_REGEX.test(email) || email === '';
};
const isValidUrl = (url: string) => {
  return URL_REGEX.test(url) || url === '';
};
const isValidPhone = (phone: string) => {
  return PHONE_REGEX.test(phone) || phone === '';
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
  scope,
  offerId,
  onSuccessfulChange,
  onChangeCompleted,
  organizerContactInfo,
  isOrganizer,
  ...props
}: Props) => {
  const { t } = useTranslation();

  // TODO: refactor
  const eventId = offerId;

  const useGetOfferByIdQuery =
    scope === OfferTypes.EVENTS ? useGetEventByIdQuery : useGetPlaceByIdQuery;

  const getOfferByIdQuery = useGetOfferByIdQuery({ id: offerId });

  const [contactInfoState, setContactInfoState] = useState<NewContactInfo[]>(
    [],
  );
  const [isFieldFocused, setIsFieldFocused] = useState(false);

  const contactInfo =
    // @ts-expect-error
    getOfferByIdQuery.data?.contactPoint ?? organizerContactInfo;

  useEffect(() => {
    if (!contactInfo) return;

    const hasContactInfo = Object.values(contactInfo).some(
      (contactInfoPerType: string[]) => contactInfoPerType.length > 0,
    );

    // onChangeCompleted can be undefined when used in OrganizerStep
    onChangeCompleted?.(hasContactInfo);

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
  }, [contactInfo, onChangeCompleted]);

  const addContactPointMutation = useAddOfferContactPointMutation({
    onSuccess: onSuccessfulChange,
  });

  const parseNewContactInfo = (newContactInfo: NewContactInfo[]) => {
    const [email, phone, url] = Object.values(ContactInfoTypes).map(
      (infoType) =>
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
      scope,
    });
  };

  const handleAddOrganizerContactInfo = (newContactInfo: NewContactInfo[]) => {
    const contactInfo = parseNewContactInfo(newContactInfo);
    onSuccessfulChange(contactInfo);
  };

  const handleChangeValue = async (
    event: FormEvent<HTMLInputElement>,
    index: number,
  ) => {
    let newValue = (event.target as HTMLInputElement).value;
    const infoType = contactInfoState[index].type;

    if (infoType === ContactInfoTypes.URL) {
      newValue = prefixUrlWithHttp(newValue);
    }

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
              alignSelf="flex-start"
              height="2.38rem"
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
              alignSelf="flex-start"
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
              alignSelf="flex-start"
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
