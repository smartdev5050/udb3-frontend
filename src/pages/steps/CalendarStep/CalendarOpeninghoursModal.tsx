import { yupResolver } from '@hookform/resolvers/yup';
import { ChangeEvent, useState } from 'react';
import { useEffect } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { DaysOfWeek } from '@/constants/DaysOfWeek';
import { useLog } from '@/hooks/useLog';
import { DayOfWeek } from '@/types/Offer';
import { Button, ButtonVariants } from '@/ui/Button';
import { CheckboxWithLabel } from '@/ui/CheckboxWithLabel';
import { Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { Modal, ModalSizes, ModalVariants } from '@/ui/Modal';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { TimeSpanPicker } from '@/ui/TimeSpanPicker';

import {
  createOpeninghoursId,
  useCalendarSelector,
} from '../machines/calendarMachine';
import { useCalendarHandlers } from '../machines/useCalendarHandlers';

const schema = yup
  .object({
    openingHours: yup.array().of(
      yup
        .object({
          id: yup.string().required(),
          closes: yup.string().required(),
          opens: yup.string().required(),
          dayOfWeek: yup
            .array()
            .of(yup.mixed<DayOfWeek>().oneOf(Object.values(DaysOfWeek)))
            .min(1),
        })
        .required(),
    ),
  } as const)
  .required();

type FormData = yup.InferType<typeof schema>;

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

  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      openingHours: [],
    },
  });

  const openingHoursField = useFieldArray({ control, name: 'openingHours' });
  const openingHours = useWatch({ control, name: 'openingHours' });

  useEffect(() => {
    if (openinghoursFromStateMachine.length === 0) {
      openingHoursField.append({
        id: createOpeninghoursId(),
        opens: '00:00',
        closes: '23:59',
        dayOfWeek: [],
      });
      return;
    }

    openingHoursField.replace(openinghoursFromStateMachine);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    openingHoursField.append,
    openingHoursField.replace,
    openinghoursFromStateMachine,
  ]);

  const handleAddOpeningHours = () => {
    openingHoursField.append({
      id: createOpeninghoursId(),
      opens: '00:00',
      closes: '23:59',
      dayOfWeek: [],
    });
  };

  const handleRemoveOpeningHours = (idToRemove: string) => {
    openingHoursField.replace(
      openingHours.filter((openingHour) => openingHour.id !== idToRemove),
    );
  };

  const handleChangeOpens = (idToChange: string, newTime: string) => {
    openingHoursField.replace(
      openingHours.map((openingHour) => {
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
    openingHoursField.replace(
      openingHours.map((openingHour) => {
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
    dayOfWeek: DayOfWeek,
    idToChange: string,
  ) => {
    const checked = event.target.checked;

    openingHoursField.replace(
      openingHours.map((openingHour) => {
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
      title={t('create.calendar.opening_hours_modal.title')}
      visible={visible}
      variant={ModalVariants.QUESTION}
      onClose={onClose}
      confirmTitle={t('create.calendar.opening_hours_modal.button_confirm')}
      cancelTitle={t('create.calendar.opening_hours_modal.button_cancel')}
      size={ModalSizes.LG}
      onConfirm={handleSubmit((data) => {
        handleChangeOpeningHours(data.openingHours);
        onClose();
      })}
    >
      <Stack spacing={4} padding={4} alignItems="flex-start">
        {openingHours.map((openingHour, index) => (
          <Stack key={openingHour.id} flex={1}>
            <Inline alignItems="center" spacing={5}>
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
                startTimeLabel={t(
                  'create.calendar.opening_hours_modal.start_time',
                )}
                endTimeLabel={t('create.calendar.opening_hours_modal.end_time')}
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
            {errors.openingHours?.[index]?.dayOfWeek?.type && (
              <Text color="red">
                {t(
                  'create.calendar.opening_hours_modal.validation_messages.day_of_week.min',
                )}
              </Text>
            )}
          </Stack>
        ))}
        <Button
          iconName={Icons.PLUS}
          variant={ButtonVariants.LINK}
          onClick={handleAddOpeningHours}
        >
          {t('create.calendar.opening_hours_modal.button_add')}
        </Button>
      </Stack>
    </Modal>
  );
};

export { CalendarOpeninghoursModal };
