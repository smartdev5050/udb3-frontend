import { Stack } from '../components/publiq-ui/Stack';
import { Title } from '../components/publiq-ui/Title';
import { Link } from '../components/publiq-ui/Link';
import { Icon, Icons } from '../components/publiq-ui/Icon';
import { getValueFromTheme } from '../components/publiq-ui/theme';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

const getValue = getValueFromTheme('pageError');

const UnexpectedError = () => {
  const { t } = useTranslation();
  const { query } = useRouter();

  return (
    <Stack
      textAlign="center"
      alignItems="center"
      marginY={6}
      spacing={3}
      flex={1}
      height="100vh"
    >
      <Icon
        name={Icons.EXCLAMATION_TRIANGLE}
        width="10rem"
        height="auto"
        color={getValue('iconColor')}
      />
      <Title size={1}>{t('error.title')}</Title>
      <Title size={2}>{query.errorMessage}</Title>
      <Link href="/dashboard" width="max-content">
        {t('error.redirect')}
      </Link>
    </Stack>
  );
};

export default UnexpectedError;
