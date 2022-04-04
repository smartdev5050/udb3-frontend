import { useCallback, useMemo, useState } from 'react';
import { useQueryClient } from 'react-query';

import { FormDataIntersection } from '@/pages/Steps';

type HandleSuccessOptions = {
  shouldInvalidateEvent?: boolean;
};

const useEditField = <TFormData extends FormDataIntersection>({
  onSuccess,
  eventId,
  handleSubmit,
  editMap,
}) => {
  const queryClient = useQueryClient();
  const [fieldLoading, setFieldLoading] = useState<string>();

  const handleSuccess = useCallback(
    (
      editedField: string,
      { shouldInvalidateEvent = true }: HandleSuccessOptions = {},
    ) => {
      onSuccess(editedField);

      if (!shouldInvalidateEvent) return;
      queryClient.invalidateQueries(['events', { id: eventId }]);
    },
    [onSuccess, eventId, queryClient],
  );

  const preparedFieldToMutationFunctionMap = useMemo(() => {
    return Object.entries(editMap).reduce((newMap, [key, hook]) => {
      return {
        // @ts-expect-error
        [key]: hook<TFormData>({ eventId, onSuccess: handleSuccess }),
        ...newMap,
      };
    }, {});
  }, [editMap, eventId, handleSuccess]);

  const editEvent = async (formData: TFormData, editedField?: string) => {
    if (!editedField) return;

    await preparedFieldToMutationFunctionMap[editedField]?.(formData);

    setFieldLoading(undefined);
  };

  const handleChange = (editedField: string) => {
    if (!eventId) return;
    setFieldLoading(editedField);
    handleSubmit(async (formData: TFormData) =>
      editEvent(formData, editedField),
    )();
  };

  return { handleChange, fieldLoading };
};

export { useEditField };
