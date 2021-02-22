import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MaxLengthReason, OfferStatus, OfferType } from './constants';
import { Modal, ModalVariants } from '../publiq-ui/Modal';
import { Stack } from '../publiq-ui/Stack';
import { ReasonAndTypeForm } from './ReasonAndTypeForm';

const StatusModal = ({ visible, className, onClose }) => {
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
      onConfirm={() => {}}
      onClose={onClose}
      confirmButtonDisabled={
        type !== OfferStatus.AVAILABLE &&
        (reason.length === 0 || reason.length > MaxLengthReason)
      }
    >
      <Stack padding={4}>
        <ReasonAndTypeForm
          offerType={OfferType.EVENT}
          statusType={type}
          statusReason={reason}
          onChangeStatusType={(e) => setType(e.target.value)}
          onInputStatusReason={(e) => setReason(e.target.value)}
        />
      </Stack>
    </Modal>
  );
};

StatusModal.propTypes = {
  visible: PropTypes.bool,
  className: PropTypes.string,
  onClose: PropTypes.func,
};

export { StatusModal };
