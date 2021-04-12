import { Page } from '@/ui/Page';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

const Create = () => {
  return (
    <Page>
      <Page.Title>create</Page.Title>
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export default Create;
