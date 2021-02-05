import { useRouter } from 'next/router';
import { QueryStatus } from '../../../hooks/api/authenticated-query';
import { useState } from 'react';
import { getApplicationServerSideProps } from '../../../utils/getApplicationServerSideProps';
import { Alert, AlertVariants } from '../../../components/publiq-ui/Alert';
import { Button, ButtonVariants } from '../../../components/publiq-ui/Button';
import { Spinner } from '../../../components/publiq-ui/Spinner';
import { RadioButtonGroup } from '../../../components/publiq-ui/RadioButtonGroup';
import { Page } from '../../../components/publiq-ui/Page';
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

  const handleError = (error) => {
    setErrorMessage(error.message);
  };
  const { data: place = {}, status } = useGetPlaceById(
    { id: placeId },
    { onError: handleError },
  );
  const name = place.name?.[i18n.language] ?? place.name?.[place.mainLanguage];

  return (
    <Page>
      <Page.Title>{t('offerStatus.title', { name })}</Page.Title>
      <Page.Content spacing={5}>
        {status === QueryStatus.LOADING ? (
          <Spinner marginTop={4} />
        ) : errorMessage ? (
          <Alert variant={AlertVariants.WARNING}>{errorMessage}</Alert>
        ) : (
          [
            <RadioButtonGroup
              key="radiobuttongroup"
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
