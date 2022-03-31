import getConfig from 'next/config';
import { useMutation } from 'react-query';

const addNewsletterSubscriber = async ({ email }: { email: string }) => {
  const { publicRuntimeConfig } = getConfig();
  const response = await fetch(
    `${publicRuntimeConfig.newsletterApiUrl}/${email}/${publicRuntimeConfig.newsletterEmailListId}`,
    {
      method: 'PUT',
    },
  );
  return await response.text();
};

const useAddNewsletterSubscriberMutation = (configuration = {}) =>
  useMutation(addNewsletterSubscriber, configuration);

export { useAddNewsletterSubscriberMutation };
