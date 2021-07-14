import { useTranslation } from 'react-i18next';

import { Page } from '@/ui/Page';
import { Text } from '@/ui/Text';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

const Create = () => {
  const { t } = useTranslation();

  return (
    <Page>
      <Page.Title spacing={6}>
        <Text>{t('movies.create.title')}</Text>
        <Text>{t('movies.create.title')}</Text>
      </Page.Title>
      <Page.Content />
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export default Create;
