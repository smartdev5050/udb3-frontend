import { Page } from '@/ui/Page';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';

const Copyright = () => {
  return (
    <Page>
      <Page.Title>Copyright</Page.Title>
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export default Copyright;
