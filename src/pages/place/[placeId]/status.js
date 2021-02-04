import { useRouter } from 'next/router';
import { QueryStatus } from '../../../hooks/api/authenticated-query';
import { useState } from 'react';
import { getApplicationServerSideProps } from '../../../utils/getApplicationServerSideProps';
import { Alert, AlertVariants } from '../../../components/publiq-ui/Alert';
import { Button, ButtonVariants } from '../../../components/publiq-ui/Button';
import { Spinner } from '../../../components/publiq-ui/Spinner';
import { Page } from '../../../components/publiq-ui/Page';
import { useTranslation } from 'react-i18next';
import { useGetPlaceById } from '../../../hooks/api/places';

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
            <Alert key="alert">{t('offerStatus.info')}</Alert>,
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
