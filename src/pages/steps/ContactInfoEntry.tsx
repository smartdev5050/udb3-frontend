import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';
import { useDeepCompareMemoize } from 'use-deep-compare-effect';

import {
  useAddBookingInfoMutation,
  useAddContactPointMutation,
  useGetEventByIdQuery,
} from '@/hooks/api/events';
import { Alert, AlertVariants } from '@/ui/Alert';
import { Button, ButtonVariants } from '@/ui/Button';
import { DatePeriodPicker } from '@/ui/DatePeriodPicker';
import { FormElement } from '@/ui/FormElement';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { LabelPositions } from '@/ui/Label';
import { RadioButtonGroup } from '@/ui/RadioButtonGroup';
import { SelectWithLabel } from '@/ui/SelectWithLabel';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { Title } from '@/ui/Title';

import { MergedInfo, TabContentProps } from './AdditionalInformationStep';

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

type BookingInfo = {
  email?: string;
  phone?: string;
  url?: string;
  urlLabel?: {
    de: string;
    en: string;
    fr: string;
    nl: string;
  };
  availabilityStarts?: Date;
  availabilityEnds?: Date;
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

const UrlLabelType = {
  BUY: 'buy',
  RESERVE: 'reserve',
  AVAILABILITY: 'availability',
  SUBSCRIBE: 'subscribe',
} as const;

const Form = ({
  type,
  contactAndBookingInfo,
  bookingInfo,
  contactInfo,
  onAddInfo,
  onAddBookingInfo,
}: {
  type: string;
  contactAndBookingInfo: ContactInfo;
  contactInfo: ContactInfo;
  bookingInfo?: BookingInfo;
  onAddInfo: (newContactInfo: ContactInfo) => Promise<void>;
  onAddBookingInfo: (newBookingInfo: BookingInfo) => Promise<void>;
}) => {
  const { t } = useTranslation();

  const urlLabelTranslationString =
    'create.additionalInformation.contact_info.url_type_labels';

  const URL_LABEL_TRANSLATIONS = {
    buy: {
      nl: t(`${urlLabelTranslationString}.buy`, { lng: 'nl' }),
      fr: t(`${urlLabelTranslationString}.buy`, { lng: 'fr' }),
      en: 'Buy tickets',
      de: t(`${urlLabelTranslationString}.buy`, { lng: 'de' }),
    },
    availability: {
      nl: t(`${urlLabelTranslationString}.availability`, { lng: 'nl' }),
      fr: t(`${urlLabelTranslationString}.availability`, { lng: 'fr' }),
      en: 'Check availability',
      de: t(`${urlLabelTranslationString}.availability`, { lng: 'de' }),
    },
    subscribe: {
      nl: t(`${urlLabelTranslationString}.subscribe`, { lng: 'nl' }),
      fr: t(`${urlLabelTranslationString}.subscribe`, { lng: 'fr' }),
      en: 'Subscribe',
      de: t(`${urlLabelTranslationString}.subscribe`, { lng: 'de' }),
    },
    reserve: {
      nl: t(`${urlLabelTranslationString}.reserve`, { lng: 'nl' }),
      fr: t(`${urlLabelTranslationString}.reserve`, { lng: 'fr' }),
      en: 'Reserve places',
      de: t(`${urlLabelTranslationString}.reserve`, { lng: 'de' }),
    },
  };

  const URL_LABELS = [
    {
      label: t('create.additionalInformation.contact_info.url_type_labels.buy'),
      value: UrlLabelType.BUY,
    },
    {
      label: t(
        'create.additionalInformation.contact_info.url_type_labels.reserve',
      ),
      value: UrlLabelType.RESERVE,
    },
    {
      label: t(
        'create.additionalInformation.contact_info.url_type_labels.availability',
      ),
      value: UrlLabelType.AVAILABILITY,
    },
    {
      label: t(
        'create.additionalInformation.contact_info.url_type_labels.subscribe',
      ),
      value: UrlLabelType.SUBSCRIBE,
    },
  ];

  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [urlLabelType, setUrlLabelType] = useState('');

  const handleAddBookingInfo = async (value: string) => {
    const newBookingInfo = { ...bookingInfo };
    newBookingInfo[type] = value;

    if (type === ContactInfoType.URL && !bookingInfo.urlLabel) {
      newBookingInfo['urlLabel'] = URL_LABEL_TRANSLATIONS.buy;
    }

    let newContactInfo = { ...contactInfo };
    newContactInfo[type] = newContactInfo[type].filter(
      (info: string) => info !== value,
    );

    // Readd old bookingInfo as contactInfo
    if (bookingInfo[type]) {
      newContactInfo[type].push(bookingInfo[type]);
    }

    await onAddInfo(newContactInfo);

    await onAddBookingInfo(newBookingInfo);
  };

  const handleAddInfo = async (): Promise<void> => {
    if (type === ContactInfoType.EMAIL && !isValidEmail(value)) {
      setErrorMessage(
        t('create.additionalInformation.contact_info.email_error'),
      );
      return;
    }

    if (type === ContactInfoType.URL && !isValidUrl(value)) {
      setErrorMessage(t('create.additionalInformation.contact_info.url_error'));
      return;
    }

    if (type === ContactInfoType.PHONE && !isValidPhone(value)) {
      setErrorMessage(
        t('create.additionalInformation.contact_info.phone_error'),
      );
      return;
    }

    setErrorMessage('');
    const newContactInfo = { ...contactInfo };
    newContactInfo[type].push(value);
    await onAddInfo(newContactInfo);
  };

  const handleDeleteInfo = async (value: string): Promise<void> => {
    if (bookingInfo[type] === value) {
      const newBookingInfo = { ...bookingInfo };
      delete newBookingInfo[type];

      if (type === ContactInfoType.URL) {
        delete newBookingInfo['urlLabel'];
      }

      await onAddBookingInfo(newBookingInfo);
    }

    let newContactInfo = { ...contactInfo };
    newContactInfo[type] = newContactInfo[type].filter(
      (info) => info !== value,
    );

    await onAddInfo(newContactInfo);
  };

  const getUrlLabelTypeByEngString = useCallback((): string => {
    if (
      bookingInfo.urlLabel?.en.toLowerCase().includes(UrlLabelType.AVAILABILITY)
    ) {
      return UrlLabelType.AVAILABILITY;
    }
    if (bookingInfo.urlLabel?.en.toLowerCase().includes(UrlLabelType.BUY)) {
      return UrlLabelType.BUY;
    }
    if (
      bookingInfo.urlLabel?.en.toLowerCase().includes(UrlLabelType.SUBSCRIBE)
    ) {
      return UrlLabelType.SUBSCRIBE;
    }
    if (bookingInfo.urlLabel?.en.toLowerCase().includes(UrlLabelType.RESERVE)) {
      return UrlLabelType.RESERVE;
    }
    return UrlLabelType.BUY;
  }, [bookingInfo.urlLabel?.en]);

  useEffect(() => {
    const urlLabel = getUrlLabelTypeByEngString();
    setUrlLabelType(urlLabel);
  }, [getUrlLabelTypeByEngString]);

  const handleOnUrlLabelChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const urlLabelType = e.target.value;
    setUrlLabelType(urlLabelType);
    const newBookingInfo = { ...bookingInfo };
    newBookingInfo.urlLabel = URL_LABEL_TRANSLATIONS[urlLabelType];

    await onAddBookingInfo(newBookingInfo);
  };

  const label = t(`create.additionalInformation.contact_info.${type}`);
  return (
    <Stack spacing={3} marginBottom={5}>
      <Title marginBottom={2}>{label}</Title>
      <Inline spacing={5} justifyContent="space-between">
        <FormElement
          flex={2}
          id={`name-${type}`}
          Component={
            <Input
              value={value}
              placeholder={t(
                `create.additionalInformation.contact_info.add_${type}_input_placeholder`,
              )}
              isInvalid={!!errorMessage}
              onChange={(e) => setValue(e.target.value)}
            />
          }
        />
        <Button
          iconName={Icons.PLUS}
          variant={ButtonVariants.SUCCESS}
          onClick={() => {
            setValue('');
            handleAddInfo();
          }}
        />
      </Inline>
      {errorMessage && (
        <Text color={getValue('errorText')}>{errorMessage}</Text>
      )}
      {contactAndBookingInfo[type].map((info: string, index: number) => {
        if (!info) return null;

        return (
          <Stack
            marginBottom={10}
            key={info}
            css={
              index !== 0
                ? css`border-top: 1px solid ${getValue('borderColor')}}`
                : ''
            }
          >
            <Inline
              paddingTop={2}
              paddingBottom={2}
              spacing={5}
              justifyContent="space-between"
            >
              <Text flex={2}>{info}</Text>
              <Button
                iconName={Icons.TRASH}
                variant={ButtonVariants.DANGER}
                onClick={() => handleDeleteInfo(info)}
              />
            </Inline>
          </Stack>
        );
      })}

      {contactAndBookingInfo[type].length > 0 && (
        <Stack spacing={4} marginTop={3}>
          <Stack>
            <SelectWithLabel
              label={t(
                'create.additionalInformation.contact_info.select_for_reservation',
                { contactInfoType: label.toLowerCase() },
              )}
              labelPosition={LabelPositions.TOP}
              onChange={(e) => handleAddBookingInfo(e.target.value)}
            >
              <option value="" disabled selected={!bookingInfo[type]}>
                {t(
                  'create.additionalInformation.contact_info.select_for_reservation',
                  { contactInfoType: label.toLowerCase() },
                )}
              </option>
              {contactAndBookingInfo[type].map(
                (contactInfo, key) =>
                  contactInfo && (
                    <option
                      key={key}
                      value={contactInfo}
                      selected={bookingInfo[type] === contactInfo}
                    >
                      {contactInfo}
                    </option>
                  ),
              )}
            </SelectWithLabel>
          </Stack>
          {type === ContactInfoType.URL && bookingInfo[type] && (
            <Stack>
              <Text fontWeight="bold">
                {t(
                  'create.additionalInformation.contact_info.select_url_label',
                )}
              </Text>
              <RadioButtonGroup
                name="urlLabel"
                items={URL_LABELS}
                selected={urlLabelType}
                onChange={handleOnUrlLabelChange}
              />
            </Stack>
          )}
        </Stack>
      )}
    </Stack>
  );
};

type ReservationPeriodProps = {
  bookingInfo: BookingInfo;
  onChangePeriod: (newBookingInfo: BookingInfo) => Promise<void>;
};

const ReservationPeriod = ({
  bookingInfo,
  onChangePeriod,
}: ReservationPeriodProps) => {
  const { t } = useTranslation();

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (bookingInfo.availabilityStarts && bookingInfo.availabilityEnds) {
      const { availabilityStarts, availabilityEnds } = bookingInfo;
      setIsDatePickerVisible(true);
      setStartDate(new Date(availabilityStarts));
      setEndDate(new Date(availabilityEnds));
    }
  }, [
    bookingInfo,
    bookingInfo.availabilityStarts,
    bookingInfo.availabilityEnds,
  ]);

  const handleEndDateBeforeStartDateError = (): void => {
    setErrorMessage(
      t(
        'create.additionalInformation.contact_info.reservation_period.error.enddate_before_startdate',
      ),
    );
  };

  const handleNewBookingPeriod = async (
    startDate: Date,
    endDate: Date,
  ): Promise<void> => {
    const newBookingInfo: BookingInfo = {
      ...bookingInfo,
      availabilityStarts: startDate,
      availabilityEnds: endDate,
    };

    await onChangePeriod(newBookingInfo);
  };

  const handleChangeStartDate = async (newStartDate: Date): Promise<void> => {
    setStartDate(newStartDate);
    if (endDate <= newStartDate) {
      handleEndDateBeforeStartDateError();
      return;
    }

    setErrorMessage('');

    await handleNewBookingPeriod(newStartDate, endDate);
  };

  const handleChangeEndDate = async (newEndDate: Date): Promise<void> => {
    setEndDate(newEndDate);

    if (newEndDate <= startDate) {
      handleEndDateBeforeStartDateError();
      return;
    }

    setErrorMessage('');

    await handleNewBookingPeriod(startDate, newEndDate);
  };

  const handleDelete = async (): Promise<void> => {
    setIsDatePickerVisible(false);

    const newBookingInfo: BookingInfo = {
      ...bookingInfo,
    };

    delete newBookingInfo.availabilityStarts;
    delete newBookingInfo.availabilityEnds;

    await onChangePeriod(newBookingInfo);

    setStartDate(new Date());
    setEndDate(new Date());
  };

  return (
    <Stack>
      <Inline>
        {!isDatePickerVisible && (
          <Button
            onClick={() => setIsDatePickerVisible(true)}
            variant={ButtonVariants.PRIMARY}
          >
            {t(
              'create.additionalInformation.contact_info.reservation_period.cta',
            )}
          </Button>
        )}
      </Inline>
      {isDatePickerVisible && (
        <Stack spacing={4}>
          <Title>
            {t(
              'create.additionalInformation.contact_info.reservation_period.title',
            )}
          </Title>
          <DatePeriodPicker
            id="reservation-date-picker"
            dateStart={startDate}
            dateEnd={endDate}
            minDate={new Date()}
            onDateStartChange={handleChangeStartDate}
            onDateEndChange={handleChangeEndDate}
          />
          {errorMessage && (
            <Alert variant={AlertVariants.DANGER}>{errorMessage}</Alert>
          )}
          <Button onClick={handleDelete} variant={ButtonVariants.LINK}>
            {t(
              'create.additionalInformation.contact_info.reservation_period.delete',
            )}
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

type Props = StackProps &
  TabContentProps & {
    withReservationInfo?: boolean;
  };

const ContactInfoEntry = ({
  eventId,
  onSuccessfulChange,
  onChangeCompleted,
  withReservationInfo,
  ...props
}: Props) => {
  const getEventByIdQuery = useGetEventByIdQuery({ id: eventId });

  // @ts-expect-error
  const contactInfo = getEventByIdQuery.data?.contactPoint;

  // @ts-expect-error
  const bookingInfo = getEventByIdQuery.data?.bookingInfo;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeCompleted = useCallback(onChangeCompleted, []);

  useEffect(() => {
    if (!contactInfo && !bookingInfo) return;
    handleChangeCompleted(true);
  }, [contactInfo, bookingInfo, handleChangeCompleted]);

  const getMergedContactAndBookingInfo = useDeepCompareMemoize<
    () => MergedInfo | undefined
  >(() => {
    if (!contactInfo) return;
    if (!bookingInfo) return contactInfo;

    const emails = new Set(contactInfo.email);
    const urls = new Set(contactInfo.url);
    const phones = new Set(contactInfo.phone);

    if (bookingInfo.email) {
      emails.add(bookingInfo.email);
    }

    if (bookingInfo.url) {
      urls.add(bookingInfo.url);
    }

    if (bookingInfo.phone) {
      phones.add(bookingInfo.phone);
    }

    return {
      email: [...emails],
      url: [...urls],
      phone: [...phones],
    };
  });

  const addContactPointMutation = useAddContactPointMutation({
    onSuccess: onSuccessfulChange,
  });

  const handleAddContactInfoMutation = async (newContactInfo: ContactInfo) => {
    await addContactPointMutation.mutateAsync({
      eventId,
      contactPoint: newContactInfo,
    });
  };

  const addBookingInfoMutation = useAddBookingInfoMutation({
    onSuccess: () => {
      setTimeout(() => {
        onSuccessfulChange();
      }, 1000);
    },
  });

  const handleAddBookingInfoMutation = async (newBookingInfo: BookingInfo) => {
    await addBookingInfoMutation.mutateAsync({
      eventId,
      bookingInfo: newBookingInfo,
    });
  };

  return (
    <Stack maxWidth="40rem" {...getStackProps(props)}>
      {getMergedContactAndBookingInfo() &&
        Object.keys(getMergedContactAndBookingInfo()).map((type: string) => {
          return (
            <Form
              contactAndBookingInfo={getMergedContactAndBookingInfo()}
              key={type}
              type={type}
              bookingInfo={bookingInfo}
              contactInfo={contactInfo}
              onAddInfo={handleAddContactInfoMutation}
              onAddBookingInfo={handleAddBookingInfoMutation}
            />
          );
        })}
      {bookingInfo && (
        <ReservationPeriod
          bookingInfo={bookingInfo}
          onChangePeriod={handleAddBookingInfoMutation}
        />
      )}
    </Stack>
  );
};

ContactInfoEntry.defaultProps = {
  withReservationInfo: false,
};

export { ContactInfoEntry };
