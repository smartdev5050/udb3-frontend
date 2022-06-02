import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef, useState } from 'react';
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
const URL_REGEX: RegExp = /https?:\/\//;

const isValidEmail = (value: any): boolean => {
  const { contactInfoType, contactInfo } = value;
  if (contactInfoType !== ContactInfoType.EMAIL) return true;

  return EMAIL_REGEX.test(contactInfo);
};

const isValidUrl = (value: any): boolean => {
  const { contactInfoType, contactInfo } = value;
  if (contactInfoType !== ContactInfoType.URL) return true;

  return URL_REGEX.test(contactInfo);
};

const hasContactInfo = (value: any): boolean => {
  const { contactInfo } = value;
  return !!contactInfo;
};

const schema = yup
  .object({
    contactPoints: yup.array().of(
      yup
        .object({
          contactInfoType: yup.string(),
          contactInfo: yup.string(),
          isUsedForReservation: yup.boolean(),
          urlLabel: yup.string().optional(),
        })
        .test('has contact info', 'error_required', hasContactInfo)
        .test('is valid email', 'email_not_valid', isValidEmail)
        .test('is valid url', 'url_not_valid', isValidUrl),
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
  const [hasInitialEventBookingInfo, setHasInitialEventBookingInfo] = useState(
    false,
  );

  const {
    register,
    watch,
    setValue,
    formState: { errors, touchedFields },
    trigger,
    handleSubmit,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { contactPoints: [] },
  });

  const watchedContactPoints = watch('contactPoints') ?? [];

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

  useEffect(() => {
    const loadContactInfoToFormData = (): void => {
      let formData = [];
      const eventBookingInfoTypes = Object.keys(eventBookingInfo);
      setHasInitialEventBookingInfo(eventBookingInfoTypes.length > 0);
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
    };

    if (eventContactInfo) {
      loadContactInfoToFormData();
    }
  }, [eventContactInfo, eventBookingInfo, setValue]);

  const handleAddContactPoint = () => {
    setValue('contactPoints', [
      ...watchedContactPoints,
      {
        contactInfoType: ContactInfoType.PHONE,
        contactInfo: '',
        isUsedForReservation: false,
        urlLabel: '',
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

  const handleAddContactPointMutation = async (contactPoints) => {
    const contactPoint = prepareContactPointPayload(contactPoints);
    await addContactPointMutation.mutateAsync({
      eventId,
      contactPoint,
    });
  };

  const handleAddBookingInfoMutation = async (contactPoints) => {
    const contactPointsUsedForReservation = contactPoints.filter(
      (contactPoint) => contactPoint.isUsedForReservation,
    );

    if (
      contactPointsUsedForReservation.length === 0 &&
      !hasInitialEventBookingInfo
    )
      return;

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

  const handleContactInfoChange = async (
    event: any,
    id: number,
    infoType: 'contactInfoType' | 'urlLabel',
  ) => {
    const contactPoints = [
      ...watchedContactPoints.map((contactPoint, index) => {
        if (id === index) {
          contactPoint[infoType] = event.target.value;
        }
        return contactPoint;
      }),
    ];

    const isFormValid = await trigger();

    if (!isFormValid) return;

    handleMutations(contactPoints);
  };

  const handleDeleteContactPoint = async (id: number) => {
    const contactPointsWithDeletedItem = watchedContactPoints.filter(
      (_contactPoint, index) => id !== index,
    );

    handleMutations(contactPointsWithDeletedItem);
  };

  const handleUseForReservation = (event: any, id: number): void => {
    const selectedContactInfoType = watchedContactPoints[id].contactInfoType;
    const alreadyHasReservationTypeIndex = watchedContactPoints.findIndex(
      (contactPoint) =>
        contactPoint.contactInfoType === selectedContactInfoType &&
        contactPoint.isUsedForReservation,
    );

    const newContactPoints = [
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
    ];

    handleAddBookingInfoMutation(newContactPoints);
  };
  const handleMutations = (contactPoints) => {
    handleAddContactPointMutation(contactPoints);
    handleAddBookingInfoMutation(contactPoints);
  };

  const onSubmitValid = (data, e) => {
    const { contactPoints } = data;
    handleMutations(contactPoints);
  };
  const onError = (errors, e) => console.log(errors, e);

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
          onSubmit={handleSubmit(onSubmitValid, onError)}
          css={`
            border: 1px solid ${getValue('borderColor')};
          `}
        >
          {watchedContactPoints.map((contactPoint, index) => {
            const registerContactInfoTypeProps = register(
              `contactPoints.${index}.contactInfoType`,
            );
            return (
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
                      {...registerContactInfoTypeProps}
                      onChange={(event) => {
                        handleContactInfoChange(
                          event,
                          index,
                          'contactInfoType',
                        );
                        registerContactInfoTypeProps.onChange(event);
                      }}
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
                        // onBlur={handleSubmit(onSubmitValid, onError)}
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
                  {errors?.contactPoints?.[index] &&
                    touchedFields?.contactPoints?.[index] && (
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
                            // onChange={(event) =>
                            //   handleContactInfoChange(event, index, 'urlLabel')
                            // }
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
            );
          })}
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
          <Button display="none" type="submit">
            Submit Form
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export { ContactInfo };
