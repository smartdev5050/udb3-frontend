import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useQueryClient } from 'react-query';

const FooterStatus = {
  HIDDEN: 'HIDDEN',
  PUBLISH: 'PUBLISH',
  MANUAL_SAVE: 'MANUAL_SAVE',
  AUTO_SAVE: 'AUTO_SAVE',
} as const;

const useFooterStatus = ({ event, form }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    formState: { dirtyFields },
  } = form;

  const isMutating = queryClient.isMutating();
  const fetchedEventId = event?.['@id'];
  const availableFrom = event?.availableFrom;
  const isPlaceDirty = dirtyFields.place || dirtyFields.location;

  const footerStatus = useMemo(() => {
    if (fetchedEventId && !availableFrom) {
      return FooterStatus.PUBLISH;
    }
    if (router.route.includes('edit')) return FooterStatus.AUTO_SAVE;
    if (isMutating) return FooterStatus.HIDDEN;
    if (isPlaceDirty) return FooterStatus.MANUAL_SAVE;
    return FooterStatus.HIDDEN;
  }, [fetchedEventId, availableFrom, isPlaceDirty, isMutating, router.route]);

  // scroll effect
  useEffect(() => {
    if (footerStatus !== FooterStatus.HIDDEN) {
      const main = document.querySelector('main');
      main.scroll({ left: 0, top: main.scrollHeight, behavior: 'smooth' });
    }
  }, [footerStatus]);

  return footerStatus;
};

export { FooterStatus, useFooterStatus };
