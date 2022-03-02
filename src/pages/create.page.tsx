import { useTranslation } from 'react-i18next';

import { Step } from '@/pages/Step';
import { Box } from '@/ui/Box';
import { Page } from '@/ui/Page';
import { Stack } from '@/ui/Stack';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

const Step2 = () => {
  const { t } = useTranslation();

  return (
    <Step stepNumber={2} title={t(`create.step2.title`)}>
      <Box>test</Box>
    </Step>
  );
};

const Create = () => {
  return (
    <Page>
      <Page.Title>create</Page.Title>
      <Page.Content>
        <Stack>
          <Step2 />
        </Stack>
      </Page.Content>
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export default Create;
