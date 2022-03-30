import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CalendarType } from '@/constants/CalendarType';
import { OfferStatus } from '@/constants/OfferStatus';
import { QueryStatus } from '@/hooks/api/authenticated-query';
import { BookingAvailabilityForm } from '@/pages/BookingAvailabilityForm';
import { StatusForm } from '@/pages/StatusForm';
import { Alert, AlertVariants } from '@/ui/Alert';
import { Button, ButtonVariants } from '@/ui/Button';
import { Inline } from '@/ui/Inline';
import { Page } from '@/ui/Page';
import { Spinner } from '@/ui/Spinner';
import { getValueFromTheme } from '@/ui/theme';
import { Title, TitleVariants } from '@/ui/Title';
import { parseOfferId } from '@/utils/parseOfferId';
import { parseOfferType } from '@/utils/parseOfferType';

const getValue = getValueFromTheme('statusPage');

const AvailabilityPageSingle = ({ offer, error, useChangeStatusMutation }) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const offerId = parseOfferId(offer['@id']);
  const offerType = parseOfferType(offer['@context']);
  const name =
    offer?.name?.[i18n.language] ?? offer?.name?.[offer.mainLanguage];
  const rawStatusType = offer?.status?.type;
  const rawStatusReason = offer?.status?.reason;
  const rawBookingAvailabilityType = offer?.bookingAvailability?.type;

  const [type, setType] = useState('');
  const [reasonInCurrentLanguage, setReasonInCurrentLanguage] = useState('');
  const [bookingAvailabilityType, setBookingAvailabilityType] = useState('');

  useEffect(() => {
    if (!rawStatusType) return;
    setType(rawStatusType);
  }, [rawStatusType]);

  useEffect(() => {
    if (!rawBookingAvailabilityType) return;
    setBookingAvailabilityType(rawBookingAvailabilityType);
  }, [rawBookingAvailabilityType]);

  useEffect(() => {
    if (type === OfferStatus.AVAILABLE) {
      setReasonInCurrentLanguage('');
    }
  }, [type]);

  useEffect(() => {
    const newReasonInCurrentLanguage = rawStatusReason?.[i18n.language];
    if (!newReasonInCurrentLanguage) return;
    setReasonInCurrentLanguage(newReasonInCurrentLanguage);
  }, [rawStatusReason, i18n.language]);

  const handleSuccess = () => router.push(`/${offerType}/${offerId}/preview`);

  const changeStatusMutation = useChangeStatusMutation({
    onSuccess: handleSuccess,
  });

  const createMutationPayload = () => {
    if (offer.calendarType === CalendarType.SINGLE) {
      return {
        eventId: offerId,
        subEventIds: [0],
        subEvents: offer?.subEvent,
        type,
        reason: {
          ...(offer.status.type === type && offer.status.reason),
          [i18n.language]: reasonInCurrentLanguage || undefined,
        },
        bookingAvailability: bookingAvailabilityType,
      };
    }

    if (type === OfferStatus.AVAILABLE) {
      return {
        id: offerId,
        type,
      };
    }
    return {
      id: offerId,
      type,
      reason: {
        ...(offer.status.type === type && offer.status.reason),
        [i18n.language]: reasonInCurrentLanguage || undefined,
      },
    };
  };

  return (
    <Page>
      <Page.Title>{t('offerStatus.title', { name })}</Page.Title>
      <Page.Content spacing={5} maxWidth="36rem">
        {changeStatusMutation.status === QueryStatus.LOADING ? (
          <Spinner marginTop={4} />
        ) : error || changeStatusMutation.error ? (
          <Alert variant={AlertVariants.WARNING}>
            {error.message || changeStatusMutation.error?.message}
          </Alert>
        ) : (
          [
            offer.calendarType === CalendarType.SINGLE && [
              <Title
                key="status-form-title"
                variant={TitleVariants.UNDERLINED}
                color={getValue('title.color')}
                lineHeight="220%"
                alignItems="center"
              >
                {t('bookingAvailability.title')}
              </Title>,
              <BookingAvailabilityForm
                key="booking-availability"
                bookingAvailabilityType={bookingAvailabilityType}
                onChangeBookingAvailability={(e) =>
                  setBookingAvailabilityType(e.target.value)
                }
              />,
            ],
            <Title
              key="status-form-title"
              variant={TitleVariants.UNDERLINED}
              color={getValue('title.color')}
              lineHeight="220%"
              alignItems="center"
            >
              {t('offerStatus.newStatus')}
            </Title>,
            <StatusForm
              key="reason-and-type"
              offerType={offerType}
              statusType={type}
              statusReason={reasonInCurrentLanguage}
              onChangeStatusType={(e) => setType(e.target.value)}
              onInputStatusReason={(e) =>
                setReasonInCurrentLanguage(e.target.value)
              }
            />,
            <Inline key="actions" spacing={3}>
              <Button
                variant={ButtonVariants.PRIMARY}
                disabled={!offer || reasonInCurrentLanguage.length > 200}
                onClick={() => {
                  changeStatusMutation.mutate(createMutationPayload());
                }}
              >
                {t('offerStatus.actions.save')}
              </Button>
              <Button
                variant={ButtonVariants.SECONDARY}
                onClick={() => router.push(`/${offerType}/${offerId}/edit`)}
              >
                {t('offerStatus.actions.cancel')}
              </Button>
            </Inline>,
          ]
        )}
      </Page.Content>
    </Page>
  );
};

AvailabilityPageSingle.propTypes = {
  offer: PropTypes.object.isRequired,
  error: PropTypes.object,
  useChangeStatusMutation: PropTypes.func.isRequired,
};

export { AvailabilityPageSingle };
