import { useTranslation } from 'react-i18next';

import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { Inline } from '@/ui/Inline';
import { getStackProps, Stack } from '@/ui/Stack';
import { Text, TextVariants } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { Title } from '@/ui/Title';

type Props = {
  withReservationInfo: boolean;
};

const ContactInfoEntry = ({ withReservationInfo = false, ...props }: Props) => {
  const { t } = useTranslation();

  return <Stack {...getStackProps(props)}></Stack>;
};

export { ContactInfoEntry };
