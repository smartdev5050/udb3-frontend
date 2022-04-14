import { useTranslation } from 'react-i18next';

import { Inline } from '@/ui/Inline';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';

type Props = {};

const ContactInfo = ({}: Props) => {
  const { t } = useTranslation();

  return (
    <Stack>
      <Inline spacing={3} marginBottom={3}>
        <Text fontWeight="bold">
          {t('create.additionalInformation.contact_info.title')}
        </Text>
      </Inline>
    </Stack>
  );
};
export { ContactInfo };
