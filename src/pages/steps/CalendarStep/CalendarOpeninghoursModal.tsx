import { useState } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, ButtonVariants } from '@/ui/Button';
import { CheckboxWithLabel } from '@/ui/CheckboxWithLabel';
import { Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Modal, ModalSizes, ModalVariants } from '@/ui/Modal';
import { Stack } from '@/ui/Stack';
import { TimeSpanPicker } from '@/ui/TimeSpanPicker';

import { OpeningHour, useCalendarSelector } from '../machines/calendarMachine';

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

const emptyOpeningHoursEntry: OpeningHour = {
  opens: '00:00',
  closes: '23:59',
  dayOfWeek: [],
};

const CalendarOpeninghoursModal = ({
  visible,
  onClose,
}: CalendarOpeninghoursModalProps) => {
  const { t } = useTranslation();

  const openinghoursFromStateMachine = useCalendarSelector(
    (state) => state.context.openingHours,
  );

  const [openingHours, setOpeningHours] = useState<OpeningHour[]>([]);

  useEffect(() => {
    if (
      openingHours.length === 0 &&
      openinghoursFromStateMachine?.length === 0
    ) {
      setOpeningHours((prevOpeningHours) => [
        ...prevOpeningHours,
        emptyOpeningHoursEntry,
      ]);
    }
  }, [openinghoursFromStateMachine, openingHours, setOpeningHours]);

  const handleAddOpeningHours = () => {
    setOpeningHours((prevOpeningHours) => [
      ...prevOpeningHours,
      emptyOpeningHoursEntry,
    ]);
  };

  return (
    <Modal
      title="Openingsuren"
      visible={visible}
      variant={ModalVariants.QUESTION}
      onClose={onClose}
      confirmTitle="Opslaan"
      cancelTitle="Annuleren"
      size={ModalSizes.LG}
      onConfirm={() => {
        onClose();
      }}
    >
      <Stack spacing={4} padding={4}>
        {openingHours.map((openingHour, index) => (
          <Inline
            alignItems="center"
            key={`openinghours-row-${index}`}
            spacing={5}
          >
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
            <TimeSpanPicker
              spacing={3}
              id={`openinghours-row-timespan`}
              startTime={openingHour.opens}
              endTime={openingHour.closes}
              onChangeStartTime={() => {
                console.log('change opens time');
              }}
              onChangeEndTime={() => {
                console.log('change closes time');
              }}
            />
          </Inline>
        ))}
        <Button
          iconName={Icons.PLUS}
          variant={ButtonVariants.LINK}
          onClick={handleAddOpeningHours}
        >
          Meer openingstijden toevoegen
        </Button>
      </Stack>
    </Modal>
  );
};

export { CalendarOpeninghoursModal };
