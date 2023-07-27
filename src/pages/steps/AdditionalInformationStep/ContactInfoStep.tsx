import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

import {
  useAddOfferContactPointMutation,
  useGetOfferByIdQuery,
} from '@/hooks/api/offers';
import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { Select } from '@/ui/Select';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { isValidInfo } from '@/utils/isValidInfo';
import { prefixUrlWithHttps } from '@/utils/url';

import { TabContentProps, ValidationStatus } from './AdditionalInformationStep';

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

type Props = StackProps &
  TabContentProps & {
    isOrganizer?: boolean;
    organizerContactInfo: ContactInfo;
  };

const ContactInfoStep = ({
  scope,
  offerId,
  onSuccessfulChange,
  onValidationChange,
  organizerContactInfo,
  isOrganizer,
  ...props
}: Props) => {
  const { t } = useTranslation();

  // TODO: refactor
  const eventId = offerId;

  const getOfferByIdQuery = useGetOfferByIdQuery({ id: offerId, scope });

  const [contactInfoState, setContactInfoState] = useState<NewContactInfo[]>(
    [],
  );

  const [isFieldFocused, setIsFieldFocused] = useState(false);
  const [isContactInfoStateInitialized, setIsContactInfoInitialized] =
    useState(false);

  const contactInfo =
    // @ts-expect-error
    getOfferByIdQuery.data?.contactPoint ?? organizerContactInfo;

  useEffect(() => {
    if (!contactInfo) return;

    if (isContactInfoStateInitialized) return;

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
    setIsContactInfoInitialized(true);
  }, [contactInfo]);

  useEffect(() => {
    if (!isContactInfoStateInitialized) return;

    const filteredContactInfoState = contactInfoState.filter(
      (contactInfo) => contactInfo.value !== '',
    );

    if (!onValidationChange) {
      return;
    }

    if (filteredContactInfoState.length === 0) {
      onValidationChange(ValidationStatus.NONE);
      return;
    }

    onValidationChange(ValidationStatus.SUCCESS);
  }, [contactInfoState]);

  const queryClient = useQueryClient();

  const addContactPointMutation = useAddOfferContactPointMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [scope, { id: offerId }],
      });

      const previousEventInfo: any = queryClient.getQueryData([
        scope,
        { id: offerId },
      ]);

      return { previousEventInfo };
    },
    onError: (_err, _newBookingInfo, context) => {
      queryClient.setQueryData(
        [scope, { id: offerId }],
        context.previousEventInfo,
      );
    },
    onSuccess: (data) => {
      if (typeof data === 'undefined') {
        return;
      }

      onValidationChange(ValidationStatus.SUCCESS);
      onSuccessfulChange(data);
    },
  });

  const parseNewContactInfo = (newContactInfo: NewContactInfo[]) => {
    const [email, phone, url] = Object.values(ContactInfoTypes).map(
      (infoType) =>
        newContactInfo
          .filter((info) => info.type === infoType && info.value !== '')
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
      newValue = prefixUrlWithHttps(newValue);
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
    newContactInfo[index].value = '';

    setContactInfoState(newContactInfo);

    await handleAddContactInfoMutation(newContactInfo);
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

export { ContactInfoStep };
export type { ContactInfo };
