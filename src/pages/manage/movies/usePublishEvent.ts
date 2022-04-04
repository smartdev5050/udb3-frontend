import { useQueryClient } from 'react-query';

import { usePublishMutation } from '@/hooks/api/events';
import { formatDateToISO } from '@/utils/formatDateToISO';

const usePublishEvent = ({ id, onSuccess }) => {
  const queryClient = useQueryClient();

  const publishMutation = usePublishMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(['events', { id }]);
      onSuccess();
    },
  });

  return async (date: Date = new Date()) => {
    if (!id) return;

    await publishMutation.mutateAsync({
      eventId: id,
      publicationDate: formatDateToISO(date),
    });
  };
};

export { usePublishEvent };
