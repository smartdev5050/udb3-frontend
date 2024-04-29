import getConfig from 'next/config';

import { useAuthenticatedMutation } from '@/hooks/api/authenticated-query';
import type { Headers } from '@/hooks/api/types/Headers';

const addNewsletter = ({
  headers,
  email,
}: {
  headers: Headers;
  email: string;
}) => {
  const { publicRuntimeConfig } = getConfig();

  return fetch(
    `${publicRuntimeConfig.newsletterApiUrl}/mailinglist/${publicRuntimeConfig.newsletterEmailListId}`,
    {
      headers,
      method: 'PUT',
      body: JSON.stringify({ email }),
    },
  );
};

const useAddNewsletterSubscriberMutation = (configuration = {}) =>
  useAuthenticatedMutation({
    mutationFn: addNewsletter,
    mutationKey: 'newsletter-add',
    ...configuration,
  });

export { useAddNewsletterSubscriberMutation };
