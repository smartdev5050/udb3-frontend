import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BookingAvailabilityForm } from '@/components/BookingAvailabilityForm';
import { StatusForm } from '@/components/StatusForm';
import { CalendarType } from '@/constants/CalendarType';
import { OfferStatus } from '@/constants/OfferStatus';
import { QueryStatus } from '@/hooks/api/authenticated-query';
import { Alert, AlertVariants } from '@/ui/Alert';
import { Button, ButtonVariants } from '@/ui/Button';
import { Inline } from '@/ui/Inline';
import { Page } from '@/ui/Page';
import { Spinner } from '@/ui/Spinner';
import { parseOfferId } from '@/utils/parseOfferId';
import { parseOfferType } from '@/utils/parseOfferType';

const AvailabilityPageSingle = ({
  offer,
  error,
  useChangeStatus,
  useChangeStatusSubEvents,
}) => {
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
  const [reason, setReason] = useState('');
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
      setReason('');
    }
  }, [type]);

  useEffect(() => {
    const newReason = offer?.status?.reason?.[i18n.language];
    if (!rawStatusReason || !newReason) return;
    setReason(newReason);
  }, [rawStatusReason]);

  const handleSuccess = () => router.push(`/${offerType}/${offerId}/preview`);

  const changeStatusMutation = useChangeStatus({
    onSuccess: handleSuccess,
  });

  const changeStatusSubEventsMutation = useChangeStatusSubEvents({
    onSuccess: handleSuccess,
  });

  const activeMutation = () => {
    if (offer.calendarType === CalendarType.SINGLE) {
      return changeStatusSubEventsMutation;
    }

    return changeStatusMutation;
  };

  const mutate = () => {
    if (offer.calendarType === CalendarType.SINGLE) {
      changeStatusSubEventsMutation.mutate({
        eventId: offerId,
        subEventIds: [0],
        subEvents: offer?.subEvent,
        type,
        reason: {
          ...(offer.status.type === type && offer.status.reason),
          [i18n.language]: reason || undefined,
        },
        bookingAvailability: bookingAvailabilityType,
      });

      return;
    }

    if (type === OfferStatus.AVAILABLE) {
      changeStatusMutation.mutate({
        id: offerId,
        type,
      });

      return;
    }

    changeStatusMutation.mutate({
      id: offerId,
      type,
      reason: {
        ...(offer.status.type === type && offer.status.reason),
        [i18n.language]: reason || undefined,
      },
    });
  };

  return (
    <Page>
      <Page.Title>{t('offerStatus.title', { name })}</Page.Title>
      <Page.Content spacing={5} maxWidth="36rem">
        {activeMutation.status === QueryStatus.LOADING ? (
          <Spinner marginTop={4} />
        ) : error || activeMutation.error ? (
          <Alert variant={AlertVariants.WARNING}>
            {error.message || activeMutation.error?.message}
          </Alert>
        ) : (
          [
            offer.calendarType === CalendarType.SINGLE && (
              <BookingAvailabilityForm
                key="booking-availability"
                bookingAvailabilityType={bookingAvailabilityType}
                onChangeBookingAvailability={(e) =>
                  setBookingAvailabilityType(e.target.value)
                }
              />
            ),
            <StatusForm
              key="reason-and-type"
              offerType={offerType}
              statusType={type}
              statusReason={reason}
              onChangeStatusType={(e) => setType(e.target.value)}
              onInputStatusReason={(e) => setReason(e.target.value)}
            />,
            <Inline key="actions" spacing={3}>
              <Button
                variant={ButtonVariants.PRIMARY}
                disabled={!offer || reason.length > 200}
                onClick={() => {
                  mutate();
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
  useChangeStatus: PropTypes.func.isRequired,
  useChangeStatusSubEvents: PropTypes.func.isRequired,
};

export { AvailabilityPageSingle };
