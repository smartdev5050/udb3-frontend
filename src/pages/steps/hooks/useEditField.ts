import { useState } from 'react';
import { useQueryClient } from 'react-query';

import { useEditTheme } from '@/pages/steps/EventTypeAndThemeStep';
import { useEditNameAndAgeRange } from '@/pages/steps/NameAndAgeRangeStep';
import { useEditLocation } from '@/pages/steps/PlaceStep';
import { useEditNameAndProduction } from '@/pages/steps/ProductionStep';
import { FormDataUnion } from '@/pages/steps/Steps';
import { useEditCalendar } from '@/pages/steps/TimeTableStep';

type HandleSuccessOptions = {
  shouldInvalidateEvent?: boolean;
};

const useEditField = <TFormData extends FormDataUnion>({
  onSuccess,
  eventId,
  handleSubmit,
}) => {
  const queryClient = useQueryClient();
  const [fieldLoading, setFieldLoading] = useState<string>();

  const handleSuccess = (
    editedField: string,
    { shouldInvalidateEvent = true }: HandleSuccessOptions = {},
  ) => {
    onSuccess(editedField);

    if (!shouldInvalidateEvent) return;
    queryClient.invalidateQueries(['events', { id: eventId }]);
  };

  const editArguments = { eventId, onSuccess: handleSuccess };

  const editTheme = useEditTheme<TFormData>(editArguments);
  const editNameAndAgeRange = useEditNameAndAgeRange<TFormData>(editArguments);
  const editCalendar = useEditCalendar(editArguments);
  const editLocation = useEditLocation(editArguments);
  const editNameAndProduction = useEditNameAndProduction(editArguments);

  const handleChange = (editedField: string) => {
    if (!eventId) return;
    setFieldLoading(editedField);

    const editMap = {
      typeAndTheme: editTheme,
      nameAndAgeRange: editNameAndAgeRange,
      timeTable: editCalendar,
      place: editLocation,
      production: editNameAndProduction,
    };

    const editEvent = editMap[editedField];

    handleSubmit(async (formData: TFormData) =>
      editEvent(formData, editedField),
    )();
  };

  return { handleChange, fieldLoading };
};

export { useEditField };
