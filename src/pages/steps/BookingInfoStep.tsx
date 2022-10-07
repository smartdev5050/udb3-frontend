import { yupResolver } from '@hookform/resolvers/yup';
import { ChangeEvent, useEffect, useState } from 'react';
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
import { getValueFromTheme } from '@/ui/theme';
import { Title } from '@/ui/Title';

import { TabContentProps } from './AdditionalInformationStep';

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
  availabilityStarts?: Date;
  availabilityEnds?: Date;
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
  onChangePeriod: (newPeriod: any) => Promise<void>;
};

const ReservationPeriod = ({
  availabilityEnds,
  availabilityStarts,
  onChangePeriod,
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
    await onChangePeriod({
      availabilityStarts: startDate,
      availabilityEnds: endDate,
    });
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
        <Stack
          spacing={4}
          padding={4}
          backgroundColor="white"
          css={`
            border: 1px solid ${getValue('borderColor')};
          `}
        >
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
  } = useForm<FormData>({
    resolver: yupResolver(schema),
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
  }, [bookingInfo, setValue]);

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

  return (
    <Stack maxWidth="50rem" {...getStackProps(props)}>
      <Inline justifyContent="space-between">
        <Stack width="50%" spacing={4}>
          <FormElement
            flex={2}
            id={`name-email`}
            label="E-mailadres"
            Component={<Input placeholder="Email" {...register('email')} />}
          />
          <FormElement
            flex={2}
            id={`name-phone`}
            label="Telefoon"
            Component={<Input placeholder="Telefoon" {...register('phone')} />}
          />
          <FormElement
            flex={2}
            id={`name-website`}
            label="Website"
            Component={<Input placeholder="Website" {...register('url')} />}
          />
        </Stack>
        <Stack width="40%">
          <ReservationPeriod
            availabilityEnds={availabilityEnds}
            availabilityStarts={availabilityStarts}
          />
        </Stack>
      </Inline>
    </Stack>
  );
};

export { BookingInfoStep, emptyContactInfo };
