import { useRouter } from 'next/router';
import { QueryStatus } from '../../../hooks/api/authenticated-query';
import { useState } from 'react';
import { getApplicationServerSideProps } from '../../../utils/getApplicationServerSideProps';
import { Alert, AlertVariants } from '../../../components/publiq-ui/Alert';
import { Button, ButtonVariants } from '../../../components/publiq-ui/Button';
import { Spinner } from '../../../components/publiq-ui/Spinner';
import { Page } from '../../../components/publiq-ui/Page';
import { useTranslation } from 'react-i18next';
import { useGetEventById } from '../../../hooks/api/events';
import { dehydrate } from 'react-query/hydration';
import { StatusModal } from '../../../components/offerStatus/StatusModal';

const Status = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { eventId } = router.query;

  const [isModalVisible, setIsModalVisible] = useState(true);
  const [errorMessage, setErrorMessage] = useState();

  const handleError = (error) => {
    setErrorMessage(error.message);
  };
  const { data: event = {}, status } = useGetEventById(
    { id: eventId },
    { onError: handleError },
  );

  const name = event.name?.[i18n.language] ?? event.name?.[event.mainLanguage];

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
            <StatusModal
              key="fds"
              visible={isModalVisible}
              onClose={() => setIsModalVisible(false)}
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

export const getServerSideProps = getApplicationServerSideProps(
  async ({ req, query, cookies, queryClient }) => {
    const { eventId } = query;
    await useGetEventById({ req, queryClient, id: eventId });

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        cookies,
      },
    };
  },
);

export default Status;
