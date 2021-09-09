import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { BookingAvailabilityType } from '@/constants/BookingAvailabilityType';
import { RadioButtonGroup } from '@/ui/RadioButtonGroup';

const BookingAvailabilityForm = ({
  bookingAvailabilityType,
  onChangeBookingAvailability,
  ...props
}) => {
  const { t } = useTranslation();

  const radioButtonItems = [
    {
      label: t(`bookingAvailability.available`),
      value: BookingAvailabilityType.AVAILABLE,
    },
    {
      label: t(`bookingAvailability.unavailable`),
      value: BookingAvailabilityType.UNAVAILABLE,
    },
  ];

  return (
    <RadioButtonGroup
      key="offerBookingAvailability"
      groupLabel={t('bookingAvailability.title')}
      name="offerBookingAvailability"
      items={radioButtonItems}
      selected={bookingAvailabilityType}
      onChange={onChangeBookingAvailability}
      {...props}
    />
  );
};

BookingAvailabilityForm.propTypes = {
  bookingAvailabilityType: PropTypes.string,
  onChangeBookingAvailability: PropTypes.func,
};

export { BookingAvailabilityForm };
