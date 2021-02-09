import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertVariants } from '../../../publiq-ui/Alert';
import { Modal, ModalVariants } from '../../../publiq-ui/Modal';
import { RadioButtonGroup } from '../../../publiq-ui/RadioButtonGroup';
import { Stack } from '../../../publiq-ui/Stack';
import { Text } from '../../../publiq-ui/Text';
import { TextAreaWithLabel } from '../../../publiq-ui/TextAreaWithLabel';
import { getValueFromTheme } from '../../../publiq-ui/theme';

const OfferStatus = {
  AVAILABLE: 'Available',
  TEMPORARILY_UNAVAILABLE: 'TemporarilyUnavailable',
  UNAVAILABLE: 'Unavailable',
};

const maxLengthReason = 200;

const getValue = getValueFromTheme('statusModal');

const EventStatusModal = ({
  subEvents,
  visible,
  className,
  changeStatuses,
  onClose,
}) => {
  const { t } = useTranslation();

  const [type, setType] = useState('');
  const [reason, setReason] = useState('');

  return (
    <Modal
      visible={visible}
      title={t('offerStatus.changeStatus')}
      variant={ModalVariants.QUESTION}
      size="xl"
      className={className}
      confirmTitle={t('offerStatus.actions.save')}
      cancelTitle={t('offerStatus.actions.close')}
      onConfirm={() => changeStatuses()}
      onClose={onClose}
    >
      <Stack padding={4} spacing={5}>
        <RadioButtonGroup
          groupLabel={t('offerStatus.newStatus')}
          name="offerStatus"
          items={[
            {
              label: t('offerStatus.status.scheduled'),
              value: OfferStatus.AVAILABLE,
            },
            {
              label: t('offerStatus.status.postponed'),
              value: OfferStatus.TEMPORARILY_UNAVAILABLE,
              info: t('offerStatus.status.postponedInfo'),
            },
            {
              label: t('offerStatus.status.cancelled'),
              value: OfferStatus.UNAVAILABLE,
              info: t('offerStatus.status.cancelledInfo'),
            },
          ]}
          selected={type}
          onChange={(e) => setType(e.target.value)}
        />
        <Stack key="reason" spacing={2}>
          <Stack spacing={3}>
            <TextAreaWithLabel
              id="reason"
              label={t('offerStatus.reason')}
              value={reason}
              onInput={(e) => setReason(e.target.value)}
            />
            {reason.length > maxLengthReason && (
              <Alert variant={AlertVariants.WARNING}>
                {t('offerStatus.maxLengthReason', {
                  amount: maxLengthReason,
                })}
              </Alert>
            )}
          </Stack>
          <Text color={getValue('infoTextColor')}>
            {t('offerStatus.reasonTip')}
          </Text>
        </Stack>
      </Stack>
    </Modal>
  );
};

EventStatusModal.propTypes = {
  subEvents: PropTypes.array.isRequired,
  visible: PropTypes.bool,
  className: PropTypes.string,
  changeStatuses: PropTypes.func,
  onClose: PropTypes.func,
};

export { EventStatusModal, OfferStatus, maxLengthReason };
