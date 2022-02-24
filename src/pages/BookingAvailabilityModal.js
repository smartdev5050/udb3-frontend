import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BookingAvailabilityForm } from '@/pages/BookingAvailabilityForm';
import { Modal, ModalSizes, ModalVariants } from '@/ui/Modal';
import { Spinner } from '@/ui/Spinner';
import { Stack } from '@/ui/Stack';

const BookingAvailabilityModal = ({
  visible,
  loading,
  className,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();

  const [bookingAvailabilityType, setBookingAvailabilityType] = useState(
    'Available',
  );

  return (
    <Modal
      visible={visible}
      title={t('bookingAvailability.change')}
      variant={ModalVariants.QUESTION}
      size={ModalSizes.LG}
      className={className}
      confirmTitle={t('bookingAvailability.actions.save')}
      cancelTitle={t('bookingAvailability.actions.close')}
      onConfirm={() => onConfirm(bookingAvailabilityType)}
      onClose={onClose}
      confirmButtonDisabled={loading}
    >
      {loading ? (
        <Spinner marginY={4} />
      ) : (
        <Stack padding={4}>
          <BookingAvailabilityForm
            bookingAvailabilityType={bookingAvailabilityType}
            onChangeBookingAvailability={(e) =>
              setBookingAvailabilityType(e.target.value)
            }
          />
        </Stack>
      )}
    </Modal>
  );
};

BookingAvailabilityModal.propTypes = {
  visible: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
};

export { BookingAvailabilityModal };
