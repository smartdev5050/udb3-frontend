import getConfig from 'next/config';
import { useMutation } from 'react-query';

const addNewsletterSubscriber = async ({ email }: { email: string }) => {
  const { publicRuntimeConfig } = getConfig();
  const response = await fetch(
    `${publicRuntimeConfig.newsletterApiUrl}/mailinglist/${publicRuntimeConfig.newsletterEmailListId}`,
    {
      method: 'PUT',
      body: JSON.stringify({ email }),
    },
  );
  return await response.text();
};

const useAddNewsletterSubscriberMutation = (configuration = {}) =>
  useMutation(addNewsletterSubscriber, configuration);

export { useAddNewsletterSubscriberMutation };
