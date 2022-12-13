import { useState } from 'react';
import { useQueryClient } from 'react-query';

import { useEditTypeAndTheme } from '@/pages/steps/EventTypeAndThemeStep';
import { useEditLocation } from '@/pages/steps/LocationStep';
import { useEditNameAndAgeRange } from '@/pages/steps/NameAndAgeRangeStep';
import { useEditNameAndProduction } from '@/pages/steps/ProductionStep';
import { FormDataUnion } from '@/pages/steps/Steps';

import { useEditCalendar } from '../CalendarStep/CalendarStep';

type HandleSuccessOptions = {
  shouldInvalidateEvent?: boolean;
};

const useEditField = ({ scope, onSuccess, offerId, handleSubmit }) => {
  const queryClient = useQueryClient();
  const [fieldLoading, setFieldLoading] = useState<string>();

  const handleSuccess = (
    editedField: string,
    { shouldInvalidateEvent = true }: HandleSuccessOptions = {},
  ) => {
    onSuccess(editedField);

    if (!shouldInvalidateEvent) return;
    queryClient.invalidateQueries(['events', { id: offerId }]);
  };

  const editArguments = { scope, offerId, onSuccess: handleSuccess };

  const editTypeAndTheme = useEditTypeAndTheme(editArguments);
  const editNameAndAgeRange = useEditNameAndAgeRange(editArguments);
  const editCalendar = useEditCalendar(editArguments);
  const editLocation = useEditLocation(editArguments);
  const editNameAndProduction = useEditNameAndProduction(editArguments);

  const handleChange = (editedField: string) => {
    if (!offerId) return;
    setFieldLoading(editedField);

    const editMap = {
      typeAndTheme: editTypeAndTheme,
      location: editLocation,
      nameAndAgeRange: editNameAndAgeRange,
      timeTable: editCalendar,
      calendar: editCalendar,
      place: editLocation,
      production: editNameAndProduction,
    };

    const editEvent = editMap[editedField];

    handleSubmit(async (formData: FormDataUnion) =>
      editEvent(formData, editedField),
    )();
  };

  return { handleChange, fieldLoading };
};

export { useEditField };
