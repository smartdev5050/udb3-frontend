import { useState } from 'react';
import { useQueryClient } from 'react-query';

import { useEditTypeAndTheme } from '@/pages/steps/EventTypeAndThemeStep';
import { useEditNameAndAgeRange } from '@/pages/steps/NameAndAgeRangeStep';
import { useEditPlace } from '@/pages/steps/PlaceStep';
import { useEditNameAndProduction } from '@/pages/steps/ProductionStep';
import { FormDataUnion } from '@/pages/steps/Steps';

import { useEditCalendar } from '../CalendarStep/CalendarStep';

type HandleSuccessOptions = {
  shouldInvalidateEvent?: boolean;
};

const useEditField = <TFormData extends FormDataUnion>({
  scope,
  onSuccess,
  offerId,
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
    queryClient.invalidateQueries(['events', { id: offerId }]);
  };

  const editArguments = { scope, offerId, onSuccess: handleSuccess };

  const editTypeAndTheme = useEditTypeAndTheme<TFormData>(editArguments);
  const editPlace = useEditPlace<TFormData>(editArguments);
  const editNameAndAgeRange = useEditNameAndAgeRange<TFormData>(editArguments);
  const editCalendar = useEditCalendar<TFormData>(editArguments);
  const editLocation = useEditPlace<TFormData>(editArguments);
  const editNameAndProduction =
    useEditNameAndProduction<TFormData>(editArguments);

  const handleChange = (editedField: string) => {
    if (!offerId) return;
    setFieldLoading(editedField);

    const editMap = {
      typeAndTheme: editTypeAndTheme,
      location: editPlace,
      nameAndAgeRange: editNameAndAgeRange,
      timeTable: editCalendar,
      calendar: editCalendar,
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
