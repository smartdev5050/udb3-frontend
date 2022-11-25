import { ChangeEvent, useState } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

import { Values } from '@/types/Values';
import { Button, ButtonVariants } from '@/ui/Button';
import { CheckboxWithLabel } from '@/ui/CheckboxWithLabel';
import { Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Modal, ModalSizes, ModalVariants } from '@/ui/Modal';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
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

type OpeningHourWithId = OpeningHour & { uuid: string };

const CalendarOpeninghoursModal = ({
  visible,
  onClose,
}: CalendarOpeninghoursModalProps) => {
  const { t } = useTranslation();

  const openinghoursFromStateMachine = useCalendarSelector(
    (state) => state.context.openingHours,
  );

  const [openingHours, setOpeningHours] = useState<OpeningHourWithId[]>([]);

  useEffect(() => {
    console.log({ openingHours });
    if (
      openingHours.length === 0 &&
      openinghoursFromStateMachine?.length === 0
    ) {
      setOpeningHours((prevOpeningHours) => [
        ...prevOpeningHours,
        {
          uuid: uuidv4(),
          opens: '00:00',
          closes: '23:59',
          dayOfWeek: [],
        },
      ]);
    }
  }, [openinghoursFromStateMachine, openingHours, setOpeningHours]);

  const handleAddOpeningHours = () => {
    setOpeningHours((prevOpeningHours) => [
      ...prevOpeningHours,
      {
        uuid: uuidv4(),
        opens: '00:00',
        closes: '23:59',
        dayOfWeek: [],
      },
    ]);
  };

  const handleRemoveOpeningHours = (uuidToRemove: string) => {
    setOpeningHours((current) =>
      current.filter((openingHour) => openingHour.uuid !== uuidToRemove),
    );
  };

  const handleChangeOpens = (uuidToChange: string, newTime: string) => {
    setOpeningHours((current) =>
      current.map((openingHour) => {
        if (openingHour.uuid === uuidToChange) {
          openingHour.opens === newTime;
        }
        return openingHour;
      }),
    );
  };
  const handleChangeCloses = (uuidToChange: string, newTime: string) => {
    setOpeningHours((current) =>
      current.map((openingHour) => {
        if (openingHour.uuid === uuidToChange) {
          openingHour.closes === newTime;
        }
        return openingHour;
      }),
    );
  };

  const handleToggleDaysOfWeek = (
    event: ChangeEvent<HTMLFormElement>,
    dayOfWeek: Values<typeof DaysOfWeek>,
    uuidToChange: string,
  ) => {
    const checked = event.target.checked;
    setOpeningHours((current) =>
      current.map((openingHour) => {
        if (openingHour.uuid === uuidToChange && checked) {
          openingHour.dayOfWeek.push(dayOfWeek);
        }
        if (
          openingHour.uuid === uuidToChange &&
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
        {openingHours.map((openingHour) => (
          <Inline
            alignItems="center"
            key={`openinghours-row-${openingHour.uuid}`}
            spacing={5}
          >
            <Inline spacing={4}>
              {Object.values(DaysOfWeek).map((dayOfWeek) => (
                <CheckboxWithLabel
                  key={`${openingHour.uuid}-${dayOfWeek}`}
                  className="day-of-week-radio"
                  id={`day-of-week-radio-${openingHour.uuid}-${dayOfWeek}`}
                  name={dayOfWeek}
                  checked={openingHour.dayOfWeek.includes(dayOfWeek)}
                  disabled={false}
                  onToggle={(e) =>
                    handleToggleDaysOfWeek(e, dayOfWeek, openingHour.uuid)
                  }
                >
                  {t(`create.calendar.days.short.${dayOfWeek}`)}
                </CheckboxWithLabel>
              ))}
            </Inline>
            <TimeSpanPicker
              spacing={3}
              id={`openinghours-row-timespan-${openingHour.uuid}`}
              startTime={openingHour.opens}
              endTime={openingHour.closes}
              onChangeStartTime={(newStartTime) => {
                handleChangeOpens(openingHour.uuid, newStartTime);
              }}
              onChangeEndTime={(newEndTime) => {
                handleChangeCloses(openingHour.uuid, newEndTime);
              }}
            />
            <Button
              iconName={Icons.TRASH}
              variant={ButtonVariants.DANGER}
              onClick={() => handleRemoveOpeningHours(openingHour.uuid)}
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
