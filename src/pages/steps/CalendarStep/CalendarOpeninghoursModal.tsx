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

import {
  createOpeninghoursId,
  OpeningHoursWithId,
  useCalendarSelector,
} from '../machines/calendarMachine';
import { useCalendarHandlers } from '../machines/useCalendarHandlers';

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

  const { handleChangeOpeningHours } = useCalendarHandlers();

  const openinghoursFromStateMachine = useCalendarSelector(
    (state) => state.context.openingHours,
  );

  const [openingHours, setOpeningHours] = useState<OpeningHoursWithId[]>([]);

  useEffect(() => {
    if (openinghoursFromStateMachine.length === 0) {
      setOpeningHours((prevOpeningHours) => [
        ...prevOpeningHours,
        {
          id: createOpeninghoursId(),
          opens: '00:00',
          closes: '23:59',
          dayOfWeek: [],
        },
      ]);
      return;
    }
    setOpeningHours(openinghoursFromStateMachine);
  }, [openinghoursFromStateMachine, setOpeningHours]);

  const handleAddOpeningHours = () => {
    setOpeningHours((prevOpeningHours) => [
      ...prevOpeningHours,
      {
        id: createOpeninghoursId(),
        opens: '00:00',
        closes: '23:59',
        dayOfWeek: [],
      },
    ]);
  };

  const handleRemoveOpeningHours = (idToRemove: string) => {
    setOpeningHours((current) =>
      current.filter((openingHour) => openingHour.id !== idToRemove),
    );
  };

  const handleChangeOpens = (idToChange: string, newTime: string) => {
    setOpeningHours((current) =>
      current.map((openingHour) => {
        if (openingHour.id === idToChange) {
          return {
            ...openingHour,
            opens: newTime,
          };
        }
        return openingHour;
      }),
    );
  };
  const handleChangeCloses = (idToChange: string, newTime: string) => {
    setOpeningHours((current) =>
      current.map((openingHour) => {
        if (openingHour.id === idToChange) {
          return {
            ...openingHour,
            closes: newTime,
          };
        }
        return openingHour;
      }),
    );
  };

  const handleToggleDaysOfWeek = (
    event: ChangeEvent<HTMLFormElement>,
    dayOfWeek: Values<typeof DaysOfWeek>,
    idToChange: string,
  ) => {
    const checked = event.target.checked;
    setOpeningHours((current) =>
      current.map((openingHour) => {
        if (openingHour.id === idToChange && checked) {
          openingHour.dayOfWeek.push(dayOfWeek);
        }
        if (
          openingHour.id === idToChange &&
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
        handleChangeOpeningHours(openingHours);
        onClose();
      }}
    >
      <Stack spacing={4} padding={4}>
        {openingHours.map((openingHour) => (
          <Inline alignItems="center" key={openingHour.id} spacing={5}>
            <Inline spacing={4}>
              {Object.values(DaysOfWeek).map((dayOfWeek) => (
                <CheckboxWithLabel
                  key={`${openingHour.id}-${dayOfWeek}`}
                  className="day-of-week-radio"
                  id={`day-of-week-radio-${openingHour.id}-${dayOfWeek}`}
                  name={dayOfWeek}
                  checked={openingHour.dayOfWeek.includes(dayOfWeek)}
                  disabled={false}
                  onToggle={(e) =>
                    handleToggleDaysOfWeek(e, dayOfWeek, openingHour.id)
                  }
                >
                  {t(`create.calendar.days.short.${dayOfWeek}`)}
                </CheckboxWithLabel>
              ))}
            </Inline>
            <TimeSpanPicker
              spacing={3}
              id={`openinghours-row-timespan-${openingHour.id}`}
              startTime={openingHour.opens}
              endTime={openingHour.closes}
              startTimeLabel={t('create.calendar.opening_hours.start_time')}
              endTimeLabel={t('create.calendar.opening_hours.end_time')}
              onChangeStartTime={(newStartTime) => {
                handleChangeOpens(openingHour.id, newStartTime);
              }}
              onChangeEndTime={(newEndTime) => {
                handleChangeCloses(openingHour.id, newEndTime);
              }}
            />
            <Button
              iconName={Icons.TRASH}
              variant={ButtonVariants.DANGER}
              onClick={() => handleRemoveOpeningHours(openingHour.id)}
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
