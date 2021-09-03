import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BookingAvailabilityForm } from '@/components/BookingAvailabilityForm';
import { Modal, ModalVariants } from '@/ui/Modal';
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

  const [bookingAvailability, setBookingAvailability] = useState('Available');

  return (
    <Modal
      visible={visible}
      title={t('bookingAvailability.change')}
      variant={ModalVariants.QUESTION}
      size="lg"
      className={className}
      confirmTitle={t('bookingAvailability.actions.save')}
      cancelTitle={t('bookingAvailability.actions.close')}
      onConfirm={() => onConfirm(bookingAvailability)}
      onClose={onClose}
      confirmButtonDisabled={loading}
    >
      {loading ? (
        <Spinner marginY={4} />
      ) : (
        <Stack padding={4}>
          <BookingAvailabilityForm
            bookingAvailability={bookingAvailability}
            onChangeBookingAvailability={(e) =>
              setBookingAvailability(e.target.value)
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
