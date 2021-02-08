import { useRouter } from 'next/router';
import { QueryStatus } from '../../../hooks/api/authenticated-query';
import { useState } from 'react';
import { getApplicationServerSideProps } from '../../../utils/getApplicationServerSideProps';
import { Alert, AlertVariants } from '../../../components/publiq-ui/Alert';
import { Button, ButtonVariants } from '../../../components/publiq-ui/Button';
import { Spinner } from '../../../components/publiq-ui/Spinner';
import { RadioButtonGroup } from '../../../components/publiq-ui/RadioButtonGroup';
import { Page } from '../../../components/publiq-ui/Page';
import { TextAreaWithLabel } from '../../../components/publiq-ui/TextAreaWithLabel';
import { useTranslation } from 'react-i18next';
import { useGetPlaceById } from '../../../hooks/api/places';

const OfferStatus = {
  AVAILABLE: 'Available',
  TEMPORARILY_UNAVAILABLE: 'TemporarilyUnavailable',
  UNAVAILABLE: 'Unavailable',
};

const Status = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { placeId } = router.query;

  const [errorMessage, setErrorMessage] = useState();
  const [status, setStatus] = useState('');
  const [, setReason] = useState('');

  const handleError = (error) => {
    setErrorMessage(error.message);
  };
  const { data: place = {}, status: getPlaceStatus } = useGetPlaceById(
    { id: placeId },
    { onError: handleError },
  );
  const name = place.name?.[i18n.language] ?? place.name?.[place.mainLanguage];
  const rawStatus = place?.status?.type;

  useEffect(() => {
    if (!rawStatus) return;
    setStatus(rawStatus);
  }, [rawStatus]);

  return (
    <Page>
      <Page.Title>{t('offerStatus.title', { name })}</Page.Title>
      <Page.Content spacing={5}>
        {getPlaceStatus === QueryStatus.LOADING ? (
          <Spinner marginTop={4} />
        ) : errorMessage ? (
          <Alert variant={AlertVariants.WARNING}>{errorMessage}</Alert>
        ) : (
          [
            <RadioButtonGroup
              key="placeStatus"
              groupLabel={t('offerStatus.newStatus')}
              name="placeStatus"
              items={[
                {
                  label: t('offerStatus.status.open'),
                  value: OfferStatus.AVAILABLE,
                },
                {
                  label: t('offerStatus.status.temporarilyClosed'),
                  value: OfferStatus.TEMPORARILY_UNAVAILABLE,
                  info: t('offerStatus.status.temporarilyClosedInfo'),
                },
                {
                  label: t('offerStatus.status.permanentlyClosed'),
                  value: OfferStatus.UNAVAILABLE,
                  info: t('offerStatus.status.permanentlyClosedInfo'),
                },
              ]}
              selected={status}
              onChange={(e) => setStatus(e.target.value)}
            />,
            <TextAreaWithLabel
              key="textarea"
              id="reason"
              label={t('offerStatus.reason')}
              onInput={(e) => setReason(e.target.value)}
            />,
            <Button
              key="button"
              variant={ButtonVariants.SUCCESS}
              width="max-content"
            >
              {t('offerStatus.modificationReady')}
            </Button>,
          ]
        )}
      </Page.Content>
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export default Status;
