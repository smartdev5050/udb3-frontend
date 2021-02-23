import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { QueryStatus } from '../../hooks/api/authenticated-query';
import { Alert, AlertVariants } from '../publiq-ui/Alert';
import { Button, ButtonVariants } from '../publiq-ui/Button';
import { Inline } from '../publiq-ui/Inline';
import { Page } from '../publiq-ui/Page';
import { Spinner } from '../publiq-ui/Spinner';
import { MaxLengthReason, OfferStatus, OfferType } from './constants';
import { parseOfferId } from '../../utils/parseOfferId';
import { parseOfferType } from '../../utils/parseOfferType';
import { useChangeStatus as useChangeStatusPlace } from '../../hooks/api/places';
import { useChangeStatus as useChangeStatusEvent } from '../../hooks/api/events';
import { useTranslation } from 'react-i18next';
import { ReasonAndTypeForm } from './ReasonAndTypeForm';

const StatusFormOnPage = ({ offer, error }) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const offerId = parseOfferId(offer['@id']);
  const offerType = parseOfferType(offer['@context']);
  const name =
    offer?.name?.[i18n.language] ?? offer?.name?.[offer.mainLanguage];
  const rawStatusType = offer?.status?.type;
  const rawStatusReason = offer?.status?.reason;

  const [type, setType] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!rawStatusType) return;
    setType(rawStatusType);
  }, [rawStatusType]);

  useEffect(() => {
    const newReason = offer?.status?.reason?.[i18n.language];
    if (!rawStatusReason || !newReason) return;
    setReason(newReason);
  }, [rawStatusReason]);

  const useChangeStatus = useMemo(() => {
    if (offerType === OfferType.PLACE) {
      return useChangeStatusPlace;
    }
    return useChangeStatusEvent;
  }, [offerType]);

  const handleSuccessChangeStatus = () =>
    router.push(`/${offerType}/${offerId}/preview`);

  const { mutate: changeStatus, ...changeStatusMutation } = useChangeStatus({
    onSuccess: handleSuccessChangeStatus,
  });

  return (
    <Page>
      <Page.Title>{t('offerStatus.title', { name })}</Page.Title>
      <Page.Content spacing={5}>
        {changeStatusMutation.status === QueryStatus.LOADING ? (
          <Spinner marginTop={4} />
        ) : error || changeStatusMutation.error ? (
          <Alert variant={AlertVariants.WARNING}>
            {error.message || changeStatusMutation.error?.message}
          </Alert>
        ) : (
          [
            <ReasonAndTypeForm
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
                disabled={
                  !offer ||
                  reason.length === 0 ||
                  reason.length > MaxLengthReason
                }
                onClick={() => {
                  changeStatus({
                    id: offerId,
                    type,
                    reason:
                      type === OfferStatus.AVAILABLE
                        ? undefined
                        : {
                            ...offer.status.reason,
                            [i18n.language]: reason,
                          },
                  });
                }}
              >
                {t('offerStatus.actions.save')}
              </Button>
              <Button
                variant={ButtonVariants.SECONDARY}
                onClick={() => router.push(`/offer/${offerId}/edit`)}
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

StatusFormOnPage.propTypes = {
  offer: PropTypes.object.isRequired,
  error: PropTypes.object,
};

export { StatusFormOnPage };
