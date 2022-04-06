import { format } from 'date-fns';
import { useMemo, useState } from 'react';

import { Inline } from '@/ui/Inline';
import { Text } from '@/ui/Text';

const useToast = ({ messages, title }) => {
  const [message, setMessage] = useState<string>();

  const clear = () => setMessage(undefined);

  const trigger = (key: string) => {
    const foundMessage = messages[key];
    if (!foundMessage) return;
    setMessage(foundMessage);
  };

  const header = useMemo(
    () => (
      <Inline as="div" flex={1} justifyContent="space-between">
        <Text>{title}</Text>
        <Text>{format(new Date(), 'HH:mm')}</Text>
      </Inline>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [message],
  );

  return { message, header, clear, trigger };
};

export { useToast };
