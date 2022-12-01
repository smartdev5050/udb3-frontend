import { ChangeEvent, useState } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Values } from '@/types/Values';
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

const CalendarOpeninghoursModal = ({
  visible,
  onClose,
}: CalendarOpeninghoursModalProps) => {
  const { t } = useTranslation();

  const openinghoursFromStateMachine = useCalendarSelector(
    (state) => state.context.openingHours,
  );

  const [openingHours, setOpeningHours] = useState<OpeningHour[]>([]);
  const [openingHoursInitialized, setOpeningHoursInitialized] = useState(false);

  useEffect(() => {
    if (openingHoursInitialized) return;
    if (
      openingHours.length === 0 &&
      openinghoursFromStateMachine?.length === 0
    ) {
      setOpeningHours((prevOpeningHours) => [
        ...prevOpeningHours,
        {
          opens: '00:00',
          closes: '23:59',
          dayOfWeek: [],
        },
      ]);
      return;
    }
    setOpeningHours(openinghoursFromStateMachine);
    setOpeningHoursInitialized(true);
  }, [
    openinghoursFromStateMachine,
    openingHours,
    setOpeningHours,
    openingHoursInitialized,
  ]);

  const handleAddOpeningHours = () => {
    setOpeningHours((prevOpeningHours) => [
      ...prevOpeningHours,
      {
        opens: '00:00',
        closes: '23:59',
        dayOfWeek: [],
      },
    ]);
  };

  const handleRemoveOpeningHours = (indexToRemove: number) => {
    setOpeningHours((current) =>
      current.filter(
        (openingHour, currentIndex) => currentIndex !== indexToRemove,
      ),
    );
  };

  const handleChangeOpens = (indexToChange: number, newTime: string) => {
    setOpeningHours((current) =>
      current.map((openingHour, openingHourIndex) => {
        if (openingHourIndex === indexToChange) {
          openingHour.opens === newTime;
        }
        return openingHour;
      }),
    );
  };
  const handleChangeCloses = (indexToChange: number, newTime: string) => {
    setOpeningHours((current) =>
      current.map((openingHour, openingHourIndex) => {
        if (openingHourIndex === indexToChange) {
          openingHour.closes === newTime;
        }
        return openingHour;
      }),
    );
  };

  const handleToggleDaysOfWeek = (
    event: ChangeEvent<HTMLFormElement>,
    dayOfWeek: Values<typeof DaysOfWeek>,
    indexToChange: number,
  ) => {
    const checked = event.target.checked;
    setOpeningHours((current) =>
      current.map((openingHour, openingHourIndex) => {
        if (openingHourIndex === indexToChange && checked) {
          openingHour.dayOfWeek.push(dayOfWeek);
        }
        if (
          openingHourIndex === indexToChange &&
          !checked &&
          openingHour.dayOfWeek.includes(dayOfWeek)
        ) {
          openingHour.dayOfWeek = openingHour.dayOfWeek.filter(
            (day) => day !== dayOfWeek,
          );
        }
        return openingHour;
      }),
    );
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
        {openingHours.map((openingHour, openingHourIndex) => (
          <Inline
            alignItems="center"
            key={`openinghours-row-${openingHourIndex}`}
            spacing={5}
          >
            <Inline spacing={4}>
              {Object.values(DaysOfWeek).map((dayOfWeek) => (
                <CheckboxWithLabel
                  key={`${openingHourIndex}-${dayOfWeek}`}
                  className="day-of-week-radio"
                  id={`day-of-week-radio-${openingHourIndex}-${dayOfWeek}`}
                  name={dayOfWeek}
                  checked={openingHour.dayOfWeek.includes(dayOfWeek)}
                  disabled={false}
                  onToggle={(e) =>
                    handleToggleDaysOfWeek(e, dayOfWeek, openingHourIndex)
                  }
                >
                  {t(`create.calendar.days.short.${dayOfWeek}`)}
                </CheckboxWithLabel>
              ))}
            </Inline>
            <TimeSpanPicker
              spacing={3}
              id={`openinghours-row-timespan-${openingHourIndex}`}
              startTime={openingHour.opens}
              endTime={openingHour.closes}
              onChangeStartTime={(newStartTime) => {
                handleChangeOpens(openingHourIndex, newStartTime);
              }}
              onChangeEndTime={(newEndTime) => {
                handleChangeCloses(openingHourIndex, newEndTime);
              }}
            />
            <Button
              iconName={Icons.TRASH}
              variant={ButtonVariants.DANGER}
              onClick={() => handleRemoveOpeningHours(openingHourIndex)}
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
