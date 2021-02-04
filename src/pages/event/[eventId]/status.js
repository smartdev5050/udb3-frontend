import { useRouter } from 'next/router';
import { useGetEventById } from '../../../hooks/api/events';
import { QueryStatus } from '../../../hooks/api/authenticated-query';
import { useState, useMemo } from 'react';
import { getApplicationServerSideProps } from '../../../utils/getApplicationServerSideProps';
import { parseOfferType } from '../../../utils/parseOfferType';
import { camelCase } from 'lodash';
import { Alert, AlertVariants } from '../../../components/publiq-ui/Alert';
import { Button, ButtonVariants } from '../../../components/publiq-ui/Button';
import { Spinner } from '../../../components/publiq-ui/Spinner';
import { Page } from '../../../components/publiq-ui/Page';
import { SelectionTable } from '../../../components/publiq-ui/SelectionTable';
import { useTranslation } from 'react-i18next';

const Status = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { eventId } = router.query;

  const [errorMessage, setErrorMessage] = useState();
  const [, setSelectedOffers] = useState([]);

  const handleError = (error) => {
    setErrorMessage(error.message);
  };
  const { data: event = {}, status } = useGetEventById(
    { id: eventId },
    { onError: handleError },
  );

  const name = event.name?.[i18n.language] ?? event.name?.[event.mainLanguage];
  const { subEvent: subEvents = [] } = event;
  const offerType = parseOfferType(event['@context'] ?? '');

  const OfferStatusMap = useMemo(
    () => ({
      event: {
        available: t('offerStatus.status.scheduled'),
        temporarilyUnavailable: t('offerStatus.status.postponed'),
        unavailable: t('offerStatus.status.cancelled'),
      },
      place: {
        available: t('offerStatus.status.open'),
        temporarilyUnavailable: t('offerStatus.status.temporarilyClosed'),
        unavailable: t('offerStatus.status.permanentlyClosed'),
      },
    }),
    [],
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Tijdstip',
        accessor: 'time',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
    ],
    [],
  );

  const data = useMemo(
    () =>
      subEvents.map((subEvent) => ({
        time: 'Dinsdag 13 Februari 2021',
        status:
          OfferStatusMap[offerType]?.[camelCase(subEvent.status.type)] ?? '',
      })),
    [subEvents],
  );

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
            <SelectionTable
              key="table"
              columns={columns}
              data={data}
              onSelectionChanged={setSelectedOffers}
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
