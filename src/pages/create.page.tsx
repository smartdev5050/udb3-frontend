import { useTranslation } from 'react-i18next';

import { Step } from '@/pages/Step';
import { Box } from '@/ui/Box';
import { Page } from '@/ui/Page';
import { Stack } from '@/ui/Stack';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

const Step1 = (props) => {
  const { t } = useTranslation();

  return (
    <Step stepNumber={1} title={t(`create.step1.title`)} {...props}>
      <Box>test</Box>
    </Step>
  );
};

const Step2 = (props) => {
  const { t } = useTranslation();

  return (
    <Step stepNumber={2} title={t(`create.step2.title`)} {...props}>
      <Box>test</Box>
    </Step>
  );
};

const Create = () => {
  return (
    <Page>
      <Page.Title>create</Page.Title>
      <Page.Content spacing={5}>
        <Step1 />
        <Step2 />
      </Page.Content>
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export default Create;
