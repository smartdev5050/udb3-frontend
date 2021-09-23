import camelCase from 'lodash/camelCase';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { OfferStatus } from '@/constants/OfferStatus';
import { QueryStatus } from '@/hooks/api/authenticated-query';
import { useChangeStatusSubEvents } from '@/hooks/api/events';
import { Alert } from '@/ui/Alert';
import { Icons } from '@/ui/Icon';
import { Link, LinkVariants } from '@/ui/Link';
import { Page } from '@/ui/Page';
import { SelectionTable } from '@/ui/SelectionTable';
import { Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { formatPeriod } from '@/utils/formatPeriod';
import { parseOfferId } from '@/utils/parseOfferId';

import { BookingAvailabilityModal } from './BookingAvailabilityModal';
import { StatusModal } from './StatusModal';

const Status = ({ type, reason }) => {
  const { i18n } = useTranslation();
  return (
    <Stack>
      <Text>{type}</Text>
      {!!reason?.[i18n.language] && (
        <Text variant={TextVariants.MUTED}>{reason[i18n.language]}</Text>
      )}
    </Stack>
  );
};

Status.propTypes = {
  type: PropTypes.string.isRequired,
  reason: PropTypes.object,
};

const AvailabilityPageMultiple = ({ event, refetchEvent }) => {
  const { t, i18n } = useTranslation();

  const eventId = parseOfferId(event['@id']);
  const name =
    event?.name?.[i18n.language] ?? event?.name?.[event.mainLanguage];
  const subEvents = event?.subEvent;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);

  const selectedSubEventIds = useMemo(() => selectedRows.map((row) => row.id), [
    selectedRows,
  ]);

  const handleSuccess = async () => {
    await refetchEvent();
    setIsModalVisible(false);
    setIsBookingModalVisible(false);
  };

  const changeSubEventsMutation = useChangeStatusSubEvents({
    onSuccess: handleSuccess,
  });

  const handleConfirmChangeStatus = async (type, reason) =>
    changeSubEventsMutation.mutate({
      eventId,
      subEventIds: selectedSubEventIds,
      subEvents,
      type,
      reason:
        reason.length > 0 && type !== OfferStatus.AVAILABLE
          ? {
              [i18n.language]: reason,
            }
          : undefined,
    });

  const handleConfirmChangeBookingAvailability = async (bookingAvailability) =>
    changeSubEventsMutation.mutate({
      eventId,
      subEventIds: selectedSubEventIds,
      subEvents,
      bookingAvailability,
    });

  const columns = useMemo(
    () => [
      {
        Header: t('offerStatus.period'),
        accessor: 'period',
      },
      {
        Header: t('offerStatus.statusLabel'),
        accessor: 'status',
      },
      {
        Header: t('bookingAvailability.label'),
        accessor: 'bookingAvailability',
      },
    ],
    [],
  );

  const data = useMemo(
    () =>
      subEvents.map((subEvent) => ({
        period: formatPeriod(
          subEvent.startDate,
          subEvent.endDate,
          i18n.language,
          t,
        ),
        status: (
          <Status
            type={t(
              `offerStatus.status.event.${camelCase(subEvent.status.type)}`,
            )}
            reason={subEvent.status.reason}
          />
        ),
        bookingAvailability: (
          <Text>
            {t(
              `bookingAvailability.${camelCase(
                subEvent.bookingAvailability.type,
              )}`,
            )}
          </Text>
        ),
      })),
    [subEvents],
  );

  return [
    <Page key="page">
      <Page.Title>{t('offerStatus.title', { name })}</Page.Title>
      <Page.Content spacing={5}>
        <Alert>{t('offerStatus.info')}</Alert>
        <SelectionTable
          columns={columns}
          data={data}
          onSelectionChanged={setSelectedRows}
          actions={[
            {
              iconName: Icons.PENCIL,
              title: t('offerStatus.changeStatus'),
              onClick: () => setIsModalVisible(true),
              disabled: selectedRows.length === 0,
            },
            {
              iconName: Icons.PENCIL,
              title: t('bookingAvailability.change'),
              onClick: () => setIsBookingModalVisible(true),
              disabled: selectedRows.length === 0,
            },
          ]}
          translateSelectedRowCount={(count) =>
            t('selectionTable.rowsSelectedCount', {
              count,
            })
          }
        />
        <Link
          href={`/event/${eventId}/preview`}
          variant={LinkVariants.BUTTON_SUCCESS}
        >
          {t('offerStatus.modificationReady')}
        </Link>
      </Page.Content>
    </Page>,
    <StatusModal
      key="modal"
      visible={isModalVisible}
      loading={changeSubEventsMutation.status === QueryStatus.LOADING}
      onConfirm={handleConfirmChangeStatus}
      onClose={() => setIsModalVisible(false)}
    />,
    <BookingAvailabilityModal
      key="bookingModal"
      visible={isBookingModalVisible}
      loading={changeSubEventsMutation.status === QueryStatus.LOADING}
      onConfirm={handleConfirmChangeBookingAvailability}
      onClose={() => setIsBookingModalVisible(false)}
    />,
  ];
};

AvailabilityPageMultiple.propTypes = {
  event: PropTypes.object.isRequired,
};

export { AvailabilityPageMultiple };
