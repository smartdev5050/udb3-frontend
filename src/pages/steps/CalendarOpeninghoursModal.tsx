import { useTranslation } from 'react-i18next';

import { CheckboxWithLabel } from '@/ui/CheckboxWithLabel';
import { Inline } from '@/ui/Inline';
import { Modal, ModalSizes, ModalVariants } from '@/ui/Modal';
import { Stack } from '@/ui/Stack';

import { useCalendarSelector } from './machines/calendarMachine';

const DaysOfWeek = {
  MONDAY: 'monday',
  TUESDAY: 'tuesday',
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
  FRIDAY: 'friday',
  SATURDAY: 'saturday',
  SUNDAY: 'sunday',
} as const;

type CalendarOpeninghoursModalProps = {
  visible: boolean;
  onClose: () => void;
};

const CalendarOpeninghoursModal = ({
  visible,
  onClose,
}: CalendarOpeninghoursModalProps) => {
  const { t } = useTranslation();

  const openinghours = useCalendarSelector(
    (state) => state.context.openingHours,
  );

  return (
    <Modal
      title="Openingsuren"
      visible={visible}
      variant={ModalVariants.QUESTION}
      onClose={onClose}
      confirmTitle="Opslaan"
      cancelTitle="Annuleren"
      size={ModalSizes.MD}
      onConfirm={() => {
        onClose();
      }}
    >
      <Stack spacing={4} padding={4}>
        <Inline spacing={4}>
          {Object.values(DaysOfWeek).map((dayOfWeek) => (
            <CheckboxWithLabel
              key={dayOfWeek}
              className="day-of-week-radio"
              id={`day-of-week-radio-${dayOfWeek}`}
              name={dayOfWeek}
              checked={false}
              disabled={false}
              onToggle={(e) => console.log('toggle')}
            >
              {t(`create.calendar.days.short.${dayOfWeek}`)}
            </CheckboxWithLabel>
          ))}
        </Inline>
      </Stack>
    </Modal>
  );
};

export { CalendarOpeninghoursModal };
