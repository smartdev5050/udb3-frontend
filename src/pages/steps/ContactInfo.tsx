import { yupResolver } from '@hookform/resolvers/yup';
import { isThisQuarter } from 'date-fns';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

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
import { Paragraph } from '@/ui/Paragraph';
import { Select } from '@/ui/Select';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

const ContactInfoType = {
  PHONE: 'phone',
  EMAIL: 'email',
  URL: 'url',
} as const;

const BookingInfoUrlLabels = {
  SUBSCRIBE: 'subscribe',
  AVAILABILITY: 'availability',
  BUY: 'buy',
  RESERVE: 'reserve',
} as const;

type ContactPoint = {
  phone: string[];
  email: string[];
  url: string[];
};

type UrlLabelInLanguages = Partial<{
  nl: string;
  fr: string;
  de: string;
  en: string;
}>;

type BookingInfo = {
  urlLabel?: UrlLabelInLanguages;
} & { [Property in keyof ContactPoint]?: string };

type Props = {
  eventId: string;
  eventContactInfo: ContactPoint;
  eventBookingInfo: BookingInfo;
  invalidateEventQuery: (field: string) => void;
  onChangeSuccess: (field: string) => void;
};

const getValue = getValueFromTheme('contactInformation');

const EMAIL_REGEX: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const isValidEmail = (value: any): boolean => {
  const { contactInfoType, contactInfo } = value;
  if (contactInfoType !== ContactInfoType.EMAIL) return true;

  return EMAIL_REGEX.test(contactInfo);
};

const schema = yup
  .object()
  .shape({
    contactPoints: yup.array().of(
      yup
        .object({
          contactInfoType: yup.string(),
          contactInfo: yup.string(),
          isUsedForReservation: yup.boolean().default(false),
          urlLabel: yup.string().optional(),
        })
        .test('is valid email', 'email_not_valid', isValidEmail),
    ),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const ContactInfo = ({
  eventId,
  eventContactInfo,
  eventBookingInfo,
  invalidateEventQuery,
  onChangeSuccess,
}: Props) => {
  const { t } = useTranslation();
  const formComponent = useRef<HTMLFormElement>();

  const {
    register,
    watch,
    setValue,
    formState: { errors },
    trigger,
    handleSubmit,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const watchedContactPoints = watch('contactPoints') ?? [];

  useEffect(() => {
    if (eventContactInfo) {
      console.log(eventContactInfo);
      let formData = [];
      const eventBookingInfoTypes = Object.keys(eventBookingInfo);
      // transform to event contact info to formData
      Object.keys(eventContactInfo).forEach((key, index) => {
        eventContactInfo[key].forEach((item) => {
          const contactInfoType = ContactInfoType[key.toUpperCase()];
          const isUsedForReservation =
            eventBookingInfoTypes.some(
              (eventBookingInfoType) =>
                eventBookingInfoType === contactInfoType,
            ) && item === eventBookingInfo[`${contactInfoType}`];

          const hasUrlBookingInfo =
            contactInfoType === ContactInfoType.URL &&
            eventBookingInfo.urlLabel?.en;

          formData.push({
            contactInfoType,
            contactInfo: item,
            isUsedForReservation,
            ...(hasUrlBookingInfo && {
              urlLabel: getUrlLabelTypeByEngString(
                eventBookingInfo.urlLabel.en,
              ),
            }),
          });
        });
      });

      setValue('contactPoints', formData);
    }
  }, [eventContactInfo, eventBookingInfo, setValue]);

  useEffect(() => {
    console.log({ errors });
  }, [errors]);

  const getUrlLabelTypeByEngString = (engUrlLabel: string): string => {
    if (engUrlLabel.toLowerCase().includes(BookingInfoUrlLabels.AVAILABILITY)) {
      return BookingInfoUrlLabels.AVAILABILITY;
    }
    if (engUrlLabel.toLowerCase().includes(BookingInfoUrlLabels.BUY)) {
      return BookingInfoUrlLabels.BUY;
    }
    if (engUrlLabel.toLowerCase().includes(BookingInfoUrlLabels.SUBSCRIBE)) {
      return BookingInfoUrlLabels.SUBSCRIBE;
    }
    if (engUrlLabel.toLowerCase().includes(BookingInfoUrlLabels.RESERVE)) {
      return BookingInfoUrlLabels.RESERVE;
    }
  };

  const handleAddContactPoint = () => {
    setValue('contactPoints', [
      ...watchedContactPoints,
      {
        contactInfoType: ContactInfoType.PHONE,
        contactInfo: '',
      },
    ]);
  };

  const addContactPointMutation = useAddContactPointMutation({
    onSuccess: async () => {
      await invalidateEventQuery('contactPoint');
      onChangeSuccess('contactPoint');
    },
  });

  const addBookingInfoMutation = useAddBookingInfoMutation({
    onSuccess: async () => {
      await invalidateEventQuery('bookingInfo');
      onChangeSuccess('bookingInfo');
    },
  });

  const deleteContactPointMutation = useAddContactPointMutation({
    onSuccess: async () => {
      console.log('on success?');
      await invalidateEventQuery('contactPoint');
      onChangeSuccess('contactPoint');
    },
  });

  const handleChangeInfoType = (event: any, id: number): void => {
    setValue('contactPoints', [
      ...watchedContactPoints.map((contactPoint, index) => {
        if (id === index) {
          contactPoint.contactInfoType = event.target.value;
        }
        return contactPoint;
      }),
    ]);
  };

  const handleChangeUrlLabel = (event: any, id: number): void => {
    setValue('contactPoints', [
      ...watchedContactPoints.map((contactPoint, index) => {
        if (id === index) {
          contactPoint.urlLabel = event.target.value;
        }
        return contactPoint;
      }),
    ]);
    handleAddBookingInfoMutation();
  };

  const prepareContactPointPayload = (contactPoints): ContactPoint => {
    const [phone, email, url] = Object.keys(ContactInfoType).map(
      (key, _index) => {
        return contactPoints
          .filter(
            (contactPoint) =>
              contactPoint.contactInfoType === ContactInfoType[key],
          )
          .map((contactPoint) => contactPoint.contactInfo);
      },
    );

    return {
      phone,
      email,
      url,
    };
  };

  const handleAddContactPointMutation = async () => {
    const result = await trigger();
    console.log({ result });
    const contactPoint = prepareContactPointPayload(watchedContactPoints);
    handleAddBookingInfoMutation();
    await addContactPointMutation.mutateAsync({
      eventId,
      contactPoint,
    });
  };

  const handleAddBookingInfoMutation = async () => {
    const contactPointsUsedForReservation = watchedContactPoints.filter(
      (contactPoint) => contactPoint.isUsedForReservation,
    );

    if (contactPointsUsedForReservation.length === 0) return;

    const bookingInfo = {};

    contactPointsUsedForReservation.forEach(
      (contactPointUsedForReservation) => {
        const contactInfoType =
          contactPointUsedForReservation['contactInfoType'];
        bookingInfo[contactInfoType] =
          contactPointUsedForReservation.contactInfo;

        if (contactInfoType === ContactInfoType.URL) {
          const urlLabelType = contactPointUsedForReservation.urlLabel;
          const urlLabelTranslationString = `create.additionalInformation.booking_info.${urlLabelType}`;
          bookingInfo['urlLabel'] = {
            nl: t(urlLabelTranslationString, { lng: 'nl' }),
            fr: t(urlLabelTranslationString, { lng: 'fr' }),
            en: t(urlLabelTranslationString, { lng: 'en' }),
            de: t(urlLabelTranslationString, { lng: 'de' }),
          };
        }
      },
    );

    await addBookingInfoMutation.mutateAsync({
      eventId,
      bookingInfo,
    });
  };

  const handleDeleteContactPoint = async (id: number) => {
    const contactPointsWithDeletedItem = watchedContactPoints.filter(
      (_contactPoint, index) => id !== index,
    );

    const contactPoint = prepareContactPointPayload(
      contactPointsWithDeletedItem,
    );

    await deleteContactPointMutation.mutateAsync({
      eventId,
      contactPoint,
    });

    // await handleAddBookingInfoMutation();
  };

  const handleUseForReservation = (event: any, id: number): void => {
    const selectedContactInfoType = watchedContactPoints[id].contactInfoType;
    const alreadyHasReservationTypeIndex = watchedContactPoints.findIndex(
      (contactPoint) =>
        contactPoint.contactInfoType === selectedContactInfoType &&
        contactPoint.isUsedForReservation,
    );

    setValue('contactPoints', [
      ...watchedContactPoints.map((contactPoint, index) => {
        // only allow 1  isUsedForReservation per type
        if (index === alreadyHasReservationTypeIndex) {
          contactPoint.isUsedForReservation = false;
        }

        if (id === index) {
          contactPoint.isUsedForReservation = true;
        }

        if (id === index && id === alreadyHasReservationTypeIndex) {
          contactPoint.isUsedForReservation = false;
        }

        return contactPoint;
      }),
    ]);
    handleAddBookingInfoMutation();
  };

  return (
    <Stack>
      <Inline spacing={3} marginBottom={3}>
        <Text fontWeight="bold">
          {t('create.additionalInformation.contact_info.title')}
        </Text>
        {watchedContactPoints.length === 0 && (
          <Button
            onClick={handleAddContactPoint}
            variant={ButtonVariants.SECONDARY}
          >
            {t('create.additionalInformation.contact_info.add')}
          </Button>
        )}
      </Inline>
      {watchedContactPoints.length > 0 && (
        <Stack
          as="form"
          ref={formComponent}
          spacing={3}
          css={`
            border: 1px solid ${getValue('borderColor')};
          `}
        >
          {watchedContactPoints.map((contactPoint, index) => (
            <Inline
              padding={3}
              key={index}
              css={
                index !== 0 &&
                `
              border-top: 1px solid ${getValue('borderColor')};
            `
              }
              spacing={5}
            >
              <FormElement
                id="contactInfoType"
                Component={
                  <Select
                    {...register(`contactPoints.${index}.contactInfoType`)}
                    onChange={(event) => handleChangeInfoType(event, index)}
                  >
                    {Object.keys(ContactInfoType).map((key, index) => (
                      <option key={index} value={ContactInfoType[key]}>
                        {t(
                          `create.additionalInformation.contact_info.${ContactInfoType[key]}`,
                        )}
                      </option>
                    ))}
                  </Select>
                }
              />
              <Stack width="40%">
                <FormElement
                  id="contactInfo"
                  Component={
                    <Input
                      {...register(`contactPoints.${index}.contactInfo`)}
                      onBlur={handleAddContactPointMutation}
                    />
                  }
                />
                <FormElement
                  id={`radioButton-${index}`}
                  Component={
                    <CheckboxWithLabel
                      id="contact-info-reservation"
                      name="contact-info-reservation"
                      className="contact-info-reservation"
                      disabled={false}
                      checked={contactPoint.isUsedForReservation}
                      onToggle={(event) =>
                        handleUseForReservation(event, index)
                      }
                    >
                      {t(
                        'create.additionalInformation.contact_info.use_for_reservation',
                      )}
                    </CheckboxWithLabel>
                  }
                />
                {errors?.contactPoints?.[index] && (
                  <Paragraph color={getValue('errorText')}>
                    {t(
                      `create.additionalInformation.contact_info.${errors.contactPoints[index].message}`,
                    )}
                  </Paragraph>
                )}
                {contactPoint.isUsedForReservation &&
                  contactPoint.contactInfoType === ContactInfoType.URL && (
                    <FormElement
                      id="contact-info-url-label"
                      Component={
                        <Select
                          {...register(`contactPoints.${index}.urlLabel`)}
                          onChange={(event) =>
                            handleChangeUrlLabel(event, index)
                          }
                        >
                          {Object.keys(BookingInfoUrlLabels).map(
                            (key, index) => (
                              <option
                                key={index}
                                value={BookingInfoUrlLabels[key]}
                              >
                                {t(
                                  `create.additionalInformation.booking_info.${BookingInfoUrlLabels[key]}`,
                                )}
                              </option>
                            ),
                          )}
                        </Select>
                      }
                    />
                  )}
              </Stack>
              <Button
                onClick={() => handleDeleteContactPoint(index)}
                variant={ButtonVariants.DANGER}
                iconName={Icons.TRASH}
                maxHeight={40}
              ></Button>
            </Inline>
          ))}
          <Inline
            padding={3}
            css={`
              border-top: 1px solid ${getValue('borderColor')};
            `}
          >
            <Button
              variant={ButtonVariants.LINK}
              onClick={handleAddContactPoint}
            >
              {t('create.additionalInformation.contact_info.add_more')}
            </Button>
          </Inline>
        </Stack>
      )}
    </Stack>
  );
};

export { ContactInfo };
