import getConfig from 'next/config';
import { useMutation } from 'react-query';

const addNewsletterSubscriber = async ({ email }: { email: string }) => {
  const { publicRuntimeConfig } = getConfig();
  const res = await fetch(
    `${publicRuntimeConfig.newsletterApiUrl}/${email}/${publicRuntimeConfig.newsletterEmailListId}`,
    {
      method: 'PUT',
    },
  );
  return await res.json();
};

const useAddNewsletterSubscriber = (configuration = {}) =>
  useMutation(addNewsletterSubscriber, configuration);

export { useAddNewsletterSubscriber };
