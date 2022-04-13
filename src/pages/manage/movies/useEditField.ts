import { useState } from 'react';
import { useQueryClient } from 'react-query';

import { FormDataIntersection } from '@/pages/Steps';
import { useEditTheme } from '@/pages/steps/EventTypeAndThemeStep';
import { useEditLocation } from '@/pages/steps/PlaceStep';
import { useEditNameAndProduction } from '@/pages/steps/ProductionStep';
import { useEditCalendar } from '@/pages/steps/TimeTableStep';

type HandleSuccessOptions = {
  shouldInvalidateEvent?: boolean;
};

const useEditField = <TFormData extends FormDataIntersection>({
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

  const editTheme = useEditTheme(editArguments);
  const editCalendar = useEditCalendar(editArguments);
  const editLocation = useEditLocation(editArguments);
  const editNameAndProduction = useEditNameAndProduction(editArguments);

  const handleChange = (editedField: string) => {
    if (!eventId) return;
    setFieldLoading(editedField);

    const editMap = {
      eventTypeAndTheme: editTheme,
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
