import getConfig from 'next/config';

import { useAuthenticatedMutation } from '@/hooks/api/authenticated-query';
import type { Headers } from '@/hooks/api/types/Headers';
import { fetchFromApi } from '@/utils/fetchFromApi';

const addNewsletter = ({
  headers,
  email,
}: {
  headers: Headers;
  email: string;
}) => {
  const { publicRuntimeConfig } = getConfig();

  return fetchFromApi({
    path: `${publicRuntimeConfig.newsletterApiUrl}/mailinglist/${publicRuntimeConfig.newsletterEmailListId}`,
    options: {
      headers,
      method: 'PUT',
      body: JSON.stringify({ email }),
    },
  });
};

const useAddNewsletterSubscriberMutation = (configuration = {}) =>
  useAuthenticatedMutation({
    mutationFn: addNewsletter,
    mutationKey: 'newsletter-add',
    ...configuration,
  });

export { useAddNewsletterSubscriberMutation };
