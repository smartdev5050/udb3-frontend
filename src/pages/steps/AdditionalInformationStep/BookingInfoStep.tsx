import { yupResolver } from '@hookform/resolvers/yup';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import * as yup from 'yup';

import { OfferTypes } from '@/constants/OfferType';
import { useGetEventByIdQuery } from '@/hooks/api/events';
import { useAddOfferBookingInfoMutation } from '@/hooks/api/offers';
import { useGetPlaceByIdQuery } from '@/hooks/api/places';
import { Alert, AlertVariants } from '@/ui/Alert';
import { Button, ButtonVariants } from '@/ui/Button';
import { DatePeriodPicker } from '@/ui/DatePeriodPicker';
import { FormElement } from '@/ui/FormElement';
import { Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { RadioButtonGroup } from '@/ui/RadioButtonGroup';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { Title } from '@/ui/Title';
import { formatDateToISO } from '@/utils/formatDateToISO';

import { TabContentProps, ValidationStatus } from './AdditionalInformationStep';
import { isValidEmail, isValidPhone, isValidUrl } from './ContactInfoStep';

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
    url: yup.string(),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const urlLabelTranslationString =
  'create.additionalInformation.booking_info.url_type_labels';

const ContactInfoType = {
  EMAIL: 'email',
  PHONE: 'phone',
  URL: 'url',
} as const;

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
        'create.additionalInformation.booking_info.reservation_period.error.enddate_before_startdate',
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
            <Text fontWeight="bold" marginBottom={2}>
              {t(
                'create.additionalInformation.booking_info.reservation_period.title',
              )}
            </Text>
            <Button
              onClick={() => setIsDatePickerVisible(true)}
              variant={ButtonVariants.SECONDARY}
            >
              {t(
                'create.additionalInformation.booking_info.reservation_period.cta',
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
              title={t(
                'create.additionalInformation.booking_info.reservation_period.delete',
              )}
              css={`
                position: absolute;
                right: 0;
                top: 0;
              `}
            ></Button>
            <Title size={3}>
              {t(
                'create.additionalInformation.booking_info.reservation_period.title',
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

type Props = StackProps & TabContentProps;

const BookingInfoStep = ({
  scope,
  offerId,
  onSuccessfulChange,
  onValidationChange,
  ...props
}: Props) => {
  const { t } = useTranslation();
  const [selectedUrlLabel, setSelectedUrlLabel] = useState('');
  const [hasInvalidUrl, setHasInvalidUrl] = useState(false);
  const queryClient = useQueryClient();

  // TODO: refactor
  const eventId = offerId;

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
      label: t('create.additionalInformation.booking_info.url_type_labels.buy'),
      value: UrlLabelType.BUY,
    },
    {
      label: t(
        'create.additionalInformation.booking_info.url_type_labels.reserve',
      ),
      value: UrlLabelType.RESERVE,
    },
    {
      label: t(
        'create.additionalInformation.booking_info.url_type_labels.availability',
      ),
      value: UrlLabelType.AVAILABILITY,
    },
    {
      label: t(
        'create.additionalInformation.booking_info.url_type_labels.subscribe',
      ),
      value: UrlLabelType.SUBSCRIBE,
    },
  ];

  const useGetOfferByIdQuery =
    scope === OfferTypes.EVENTS ? useGetEventByIdQuery : useGetPlaceByIdQuery;

  const getOfferByIdQuery = useGetOfferByIdQuery({ id: offerId });

  // @ts-expect-error
  const bookingInfo = getOfferByIdQuery.data?.bookingInfo;

  const { register, handleSubmit, formState, control, setValue, getValues } =
    useForm<FormData>({
      mode: 'onBlur',
      resolver: yupResolver(schema),
      reValidateMode: 'onBlur',
    });

  useEffect(() => {
    if (!bookingInfo) return;

    const hasBookingInfo = Object.keys(bookingInfo).length > 0;

    onValidationChange(hasBookingInfo);

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
  }, [offerId, setValue, bookingInfo, onValidationChange]);

  useEffect(() => {
    if (!bookingInfo?.urlLabel?.en) return;

    if (bookingInfo.urlLabel.en) {
      const urlLabel = getUrlLabelType(bookingInfo.urlLabel.en);
      setSelectedUrlLabel(urlLabel);
    }
  }, [bookingInfo?.urlLabel?.en]);

  const [url, availabilityStarts, availabilityEnds] = useWatch({
    control,
    name: ['url', 'availabilityStarts', 'availabilityEnds'],
  });

  const addBookingInfoMutation = useAddOfferBookingInfoMutation({
    onSuccess: onSuccessfulChange,
    onMutate: async (newPayload) => {
      await queryClient.cancelQueries({
        queryKey: ['events', { id: eventId }],
      });

      const previousEventInfo: any = queryClient.getQueryData([
        'events',
        { id: eventId },
      ]);

      queryClient.setQueryData(['events', { id: eventId }], () => {
        return { ...previousEventInfo, bookingInfo: newPayload.bookingInfo };
      });

      return { previousEventInfo };
    },
    onError: (_err, _newBookingInfo, context) => {
      queryClient.setQueryData(
        ['events', { id: eventId }],
        context.previousEventInfo,
      );
    },
  });

  const handleAddBookingInfoMutation = async (newBookingInfo: BookingInfo) => {
    const bookingInfo = newBookingInfo;
    const newUrlLabels =
      URL_LABEL_TRANSLATIONS[selectedUrlLabel] ??
      URL_LABEL_TRANSLATIONS.reserve;

    if (bookingInfo.url && !bookingInfo.url.startsWith('http')) {
      bookingInfo.url = `http://${bookingInfo.url}`;
    }

    if (bookingInfo.url && !isValidUrl(bookingInfo.url)) {
      setHasInvalidUrl(true);
      return;
    } else {
      setHasInvalidUrl(false);
    }

    if (bookingInfo.url === '') {
      delete bookingInfo.urlLabel;
      delete bookingInfo.url;
    }

    if (bookingInfo.phone === '') {
      delete bookingInfo.phone;
    }

    if (bookingInfo.email === '') {
      delete bookingInfo.email;
    }

    if (
      !Object.keys(bookingInfo).some((key) =>
        ['phone', 'url', 'email'].includes(key),
      ) &&
      bookingInfo.availabilityEnds &&
      bookingInfo.availabilityStarts
    ) {
      delete bookingInfo.availabilityEnds;
      delete bookingInfo.availabilityStarts;
    }

    await addBookingInfoMutation.mutateAsync({
      eventId,
      bookingInfo: {
        ...bookingInfo,
        ...(Object.hasOwn(bookingInfo, 'url') && {
          urlLabel: newUrlLabels,
        }),
      },
      scope,
    });
  };

  const handleChangeBookingPeriod = async (
    availabilityEnds: Date,
    availabilityStarts: Date,
  ) => {
    const isoEndDate = formatDateToISO(availabilityEnds);
    const isoStartDate = formatDateToISO(availabilityStarts);

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

    const formValues = getValues();

    await handleAddBookingInfoMutation({
      ...formValues,
      urlLabel: newUrlLabels,
    });
  };

  return (
    <Stack maxWidth="55rem" {...getStackProps(props)}>
      <Inline justifyContent="space-between">
        <Stack
          as="form"
          width="45%"
          spacing={4}
          onBlur={handleSubmit(async (data) => {
            await handleAddBookingInfoMutation(data);
          })}
          ref={formComponent}
        >
          {Object.keys(ContactInfoType).map((key, index) => {
            const type = ContactInfoType[key];
            return (
              <FormElement
                key={index}
                flex={2}
                id={type}
                label={t(`create.additionalInformation.booking_info.${type}`)}
                Component={
                  <Input
                    placeholder={t(
                      `create.additionalInformation.booking_info.${type}`,
                    )}
                    {...register(type)}
                  />
                }
                error={
                  (formState.errors?.[type] &&
                    t(
                      `create.additionalInformation.booking_info.${type}_error`,
                    )) ||
                  (type === ContactInfoType.URL &&
                    hasInvalidUrl &&
                    t(`create.additionalInformation.booking_info.url_error`))
                }
              />
            );
          })}
          {url && (
            <Stack>
              <Text fontWeight="bold">
                {t(
                  'create.additionalInformation.booking_info.select_url_label',
                )}
              </Text>
              <RadioButtonGroup
                name="urlLabel"
                selected={selectedUrlLabel}
                items={URL_LABELS}
                onChange={(e) => {
                  setSelectedUrlLabel(e.target.value);
                  handleOnUrlLabelChange(e);
                }}
              />
            </Stack>
          )}
        </Stack>
        <Stack width="50%">
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

export { BookingInfoStep };
