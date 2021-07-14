import { useTranslation } from 'react-i18next';

import { Badge, BadgeVariants } from '@/ui/Badge';
import { Page } from '@/ui/Page';
import { Text } from '@/ui/Text';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

const Create = () => {
  const { t } = useTranslation();

  return (
    <Page>
      <Page.Title spacing={4} alignItems="center">
        <Badge
          variant={BadgeVariants.SECONDARY}
          borderRadius="50%"
          width="2rem"
          height="2rem"
          lineHeight="2rem"
        >
          1
        </Badge>
        <Text>{t('movies.create.step1_title')}</Text>
      </Page.Title>
      <Page.Content />
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export default Create;
