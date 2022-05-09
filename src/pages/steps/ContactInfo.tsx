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
import { Select } from '@/ui/Select';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

const ContactInfoType = {
  PHONE: 'phone',
  EMAIL: 'email',
  URL: 'url',
} as const;

type ContactPoint = {
  phone: string[];
  email: string[];
  url: string[];
};

type BookingInfo = {
  [Property in keyof ContactPoint]?: string;
};

type Props = {
  eventId: string;
  eventContactInfo: ContactPoint;
  eventBookingInfo: BookingInfo;
  invalidateEventQuery: (field: string) => void;
};

const getValue = getValueFromTheme('contactInformation');

const isValidEmail = (value: any): boolean => {
  console.log(value);
  return true;
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
        })
        .test(`is-email-valid`, 'email is not valid', isValidEmail),
    ),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const ContactInfo = ({
  eventId,
  eventContactInfo,
  eventBookingInfo,
  invalidateEventQuery,
}: Props) => {
  const { t } = useTranslation();
  const formComponent = useRef<HTMLFormElement>();

  const {
    register,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const watchedContactPoints = watch('contactPoints') ?? [];

  useEffect(() => {
    if (eventContactInfo) {
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

          formData.push({
            contactInfoType,
            contactInfo: item,
            isUsedForReservation,
          });
        });
      });

      setValue('contactPoints', formData);
    }
  }, [eventContactInfo, eventBookingInfo, setValue]);

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
      console.log('added contact point');
    },
  });

  const addBookingInfoMutation = useAddBookingInfoMutation({
    onSuccess: async () => {
      console.log('added booking info');
    },
  });

  const deleteContactPointMutation = useAddContactPointMutation({
    onSuccess: async () => {
      await invalidateEventQuery('contactPoint');
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
    const contactPoint = prepareContactPointPayload(watchedContactPoints);
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
              <Stack>
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
              </Stack>
              <Button
                onClick={() => handleDeleteContactPoint(index)}
                variant={ButtonVariants.DANGER}
                iconName={Icons.TRASH}
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
