import { useTranslation } from 'react-i18next';

import { Page } from '@/ui/Page';
import { TimeTable } from '@/ui/TimeTable';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

const Create = () => {
  const { t } = useTranslation();

  return (
    <Page>
      <Page.Title>{t('movies.create.title')}</Page.Title>
      <Page.Content>
        <TimeTable id="timetable-movies" />
      </Page.Content>
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export default Create;
