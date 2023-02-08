import { FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, ButtonVariants } from '@/ui/Button';
import { Stack } from '@/ui/Stack';

import { FormDataUnion } from '../Steps';
import { Days } from './Days';

type OneOrMoreDaysProps = {
  onAddDay: () => void;
  onDeleteDay: (id: string) => void;
  onChangeStartDate: (id: string, date: Date | null) => void;
  onChangeEndDate: (id: string, date: Date | null) => void;
  onChangeStartTime: (id: string, hours: number, minutes: number) => void;
  onChangeEndTime: (id: string, hours: number, minutes: number) => void;
  errors: FieldErrors<FormDataUnion>;
};
export const OneOrMoreDays = ({
  onAddDay,
  errors,
  ...handlers
}: OneOrMoreDaysProps) => {
  const { t } = useTranslation();
  return (
    <Stack spacing={5} alignItems="flex-start">
      <Days {...handlers} errors={errors} />
      <Button variant={ButtonVariants.SECONDARY} onClick={onAddDay}>
        {t('create.calendar.one_or_more_days.button_add')}
      </Button>
    </Stack>
  );
};
