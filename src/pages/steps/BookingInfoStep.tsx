import { yupResolver } from '@hookform/resolvers/yup';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';
import * as yup from 'yup';

import {
  useAddBookingInfoMutation,
  useGetEventByIdQuery,
} from '@/hooks/api/events';
import { Alert, AlertVariants } from '@/ui/Alert';
import { Button, ButtonVariants } from '@/ui/Button';
import { DatePeriodPicker } from '@/ui/DatePeriodPicker';
import { FormElement } from '@/ui/FormElement';
import { Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { LabelPositions } from '@/ui/Label';
import { RadioButtonGroup } from '@/ui/RadioButtonGroup';
import { SelectWithLabel } from '@/ui/SelectWithLabel';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { Title } from '@/ui/Title';

import { TabContentProps } from './AdditionalInformationStep';

const EMAIL_REGEX: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const URL_REGEX: RegExp = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
const PHONE_REGEX: RegExp = /^[0-9\/_.+ ]*$/;

const isValidEmail = (email: string): boolean => {
  return !email || EMAIL_REGEX.test(email);
};
const isValidUrl = (url: string): boolean => {
  return !url || URL_REGEX.test(url);
};
const isValidPhone = (phone: string): boolean => {
  return !phone || PHONE_REGEX.test(phone);
};

const schema = yup
  .object({
    availabilityEnds: yup.string(),
    availabilityStarts: yup.string(),
    email: yup
      .string()
      .test(`email-is-not-valid`, 'email is not valid', isValidEmail),
    phone: yup
      .string()
      .test(`phone-is-not-valid`, 'phone is not valid', isValidPhone),
    url: yup
      .string()
      .test(`website-is-not-valid`, 'url is not valid', isValidUrl),
    urlLabel: yup.object({
      de: yup.string(),
      en: yup.string(),
      fr: yup.string(),
      nl: yup.string(),
    }),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const urlLabelTranslationString =
  'create.additionalInformation.contact_info.url_type_labels';

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

const emptyContactInfo: ContactInfo = {
  email: [],
  url: [],
  phone: [],
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
  availabilityStarts?: string;
  availabilityEnds?: string;
};

const emptyBookingInfo: BookingInfo = {};

const getValue = getValueFromTheme('contactInformation');

const UrlLabelType = {
  BUY: 'buy',
  RESERVE: 'reserve',
  AVAILABILITY: 'availability',
  SUBSCRIBE: 'subscribe',
} as const;

const getUrlLabelType = (englishUrlLabel: string): string => {
  if (englishUrlLabel.toLowerCase().includes(UrlLabelType.AVAILABILITY))
    return UrlLabelType.AVAILABILITY;

  if (englishUrlLabel.toLowerCase().includes(UrlLabelType.BUY))
    return UrlLabelType.BUY;

  if (englishUrlLabel.toLowerCase().includes(UrlLabelType.SUBSCRIBE))
    return UrlLabelType.SUBSCRIBE;

  if (englishUrlLabel.toLowerCase().includes(UrlLabelType.RESERVE))
    return UrlLabelType.RESERVE;

  return UrlLabelType.BUY;
};

type ReservationPeriodProps = {
  availabilityStarts: string;
  availabilityEnds: string;
  handleDelete: () => Promise<void>;
  handlePeriodChange: (
    availabilityEnds: Date,
    availabilityStarts: Date,
  ) => Promise<void>;
};

const ReservationPeriod = ({
  availabilityEnds,
  availabilityStarts,
  handleDelete,
  handlePeriodChange,
}: ReservationPeriodProps) => {
  const { t } = useTranslation();

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!availabilityEnds || !availabilityStarts) {
      return;
    }

    setIsDatePickerVisible(true);
    setStartDate(new Date(availabilityStarts));
    setEndDate(new Date(availabilityEnds));
  }, [availabilityEnds, availabilityStarts]);

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
    await handlePeriodChange(endDate, startDate);
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

  return (
    <Stack>
      <Inline>
        {!isDatePickerVisible && (
          <Stack>
            <Text fontWeight="bold" marginBottom={3}>
              Reservatieperiode
            </Text>
            <Button
              onClick={() => setIsDatePickerVisible(true)}
              variant={ButtonVariants.SECONDARY}
            >
              {t(
                'create.additionalInformation.contact_info.reservation_period.cta',
              )}
            </Button>
          </Stack>
        )}
      </Inline>
      {isDatePickerVisible && (
        <Stack
          padding={4}
          backgroundColor="white"
          css={`
            border: 1px solid ${getValue('borderColor')};
          `}
        >
          <Stack
            spacing={4}
            css={`
              position: relative;
            `}
          >
            <Button
              iconName={Icons.TRASH}
              variant={ButtonVariants.DANGER}
              onClick={() => {
                handleDelete();
                setIsDatePickerVisible(false);
              }}
              css={`
                position: absolute;
                right: 0;
                top: 0;
              `}
            ></Button>
            <Title size={3}>
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
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

type Props = StackProps &
  TabContentProps & {
    withReservationInfo?: boolean;
    isOrganizer?: boolean;
    organizerContactInfo: ContactInfo;
  };

const BookingInfoStep = ({
  eventId,
  onSuccessfulChange,
  onChangeCompleted,
  withReservationInfo,
  organizerContactInfo,
  isOrganizer,
  ...props
}: Props) => {
  const { t } = useTranslation();

  const formComponent = useRef<HTMLFormElement>();

  const UrlLabelType = {
    BUY: 'buy',
    RESERVE: 'reserve',
    AVAILABILITY: 'availability',
    SUBSCRIBE: 'subscribe',
  } as const;

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

  const getEventByIdQuery = useGetEventByIdQuery({ id: eventId });

  // @ts-expect-error
  const bookingInfo = getEventByIdQuery.data?.bookingInfo;

  console.log({ bookingInfo });

  const {
    register,
    handleSubmit,
    formState,
    watch,
    setValue,
    trigger,
    clearErrors,
    getValues,
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    reValidateMode: 'onBlur',
  });

  useEffect(() => {
    if (!bookingInfo) return;

    Object.values(ContactInfoType).map((type) => {
      if (bookingInfo?.[type]) {
        setValue(type, bookingInfo[type]);
      }
    });

    if (bookingInfo.availabilityStarts) {
      setValue('availabilityStarts', bookingInfo.availabilityStarts);
    }

    if (bookingInfo.availabilityEnds) {
      setValue('availabilityEnds', bookingInfo.availabilityEnds);
    }

    if (bookingInfo.urlLabel) {
      setValue('urlLabel', bookingInfo.urlLabel);
    }
  }, [bookingInfo, setValue]);

  const url = watch('url');
  const urlLabel = watch('urlLabel');
  const availabilityEnds = watch('availabilityEnds');
  const availabilityStarts = watch('availabilityStarts');

  const addBookingInfoMutation = useAddBookingInfoMutation({
    onSuccess: onSuccessfulChange,
  });

  const handleAddBookingInfoMutation = async (newBookingInfo: BookingInfo) => {
    await addBookingInfoMutation.mutateAsync({
      eventId,
      bookingInfo: newBookingInfo,
    });
  };

  const handleChangeBookingPeriod = async (
    availabilityEnds: Date,
    availabilityStarts: Date,
  ) => {
    const isoEndDate = availabilityEnds.toISOString();
    const isoStartDate = availabilityStarts.toISOString();

    setValue('availabilityEnds', isoEndDate);
    setValue('availabilityStarts', isoStartDate);

    const formValues = getValues();

    await handleAddBookingInfoMutation({
      ...formValues,
      availabilityEnds: isoEndDate,
      availabilityStarts: isoStartDate,
    });
  };

  const handleDeleteBookingPeriod = async () => {
    const formValues = getValues();

    await handleAddBookingInfoMutation({
      ...formValues,
      availabilityEnds: undefined,
      availabilityStarts: undefined,
    });
  };

  const handleOnUrlLabelChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const urlLabelType = e.target.value;
    const newUrlLabels = URL_LABEL_TRANSLATIONS[urlLabelType];
    setValue('urlLabel', newUrlLabels);

    const formValues = getValues();

    await handleAddBookingInfoMutation({
      ...formValues,
      urlLabel: newUrlLabels,
    });
  };

  return (
    <Stack maxWidth="50rem" {...getStackProps(props)}>
      <Inline justifyContent="space-between">
        <Stack
          as="form"
          width="50%"
          spacing={4}
          onBlur={handleSubmit(async (data) => {
            await handleAddBookingInfoMutation(data);
          })}
          ref={formComponent}
        >
          <FormElement
            flex={2}
            id={`email`}
            label="E-mailadres"
            Component={<Input placeholder="Email" {...register('email')} />}
            error={formState.errors.email?.message}
          />
          <FormElement
            flex={2}
            id={`phone`}
            label="Telefoon"
            Component={<Input placeholder="Telefoon" {...register('phone')} />}
            error={formState.errors.phone?.message}
          />
          <FormElement
            flex={2}
            id={`url`}
            label="Website"
            Component={<Input placeholder="Website" {...register('url')} />}
            error={formState.errors.url?.message}
          />
          {url && (
            <RadioButtonGroup
              name="urlLabel"
              selected={getUrlLabelType(urlLabel.en)}
              items={URL_LABELS}
              onChange={handleOnUrlLabelChange}
            />
          )}
        </Stack>
        <Stack width="40%">
          <ReservationPeriod
            handlePeriodChange={handleChangeBookingPeriod}
            handleDelete={handleDeleteBookingPeriod}
            availabilityEnds={availabilityEnds}
            availabilityStarts={availabilityStarts}
          />
        </Stack>
      </Inline>
    </Stack>
  );
};

export { BookingInfoStep, emptyContactInfo };
