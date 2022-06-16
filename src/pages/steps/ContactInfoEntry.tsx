import { useTranslation } from 'react-i18next';

import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

const ContactInfoEntry = ({ ...props }) => {
  const { t } = useTranslation();

  return (
    <Stack {...getStackProps(props)}>
      <p>ContactInfoEntry</p>
    </Stack>
  );
};

export { ContactInfoEntry };
