import { Page } from '@/ui/Page';
import { Text } from '@/ui/Text';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

const Create = () => {
  return (
    <Page>
      <Page.Title>create</Page.Title>
      <Page.Content spacing={5}>
        <Text>test</Text>
      </Page.Content>
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export default Create;
