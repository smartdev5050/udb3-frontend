import { Cookies } from 'react-cookie';

const Index = () => null;

export const getServerSideProps = ({ req }) => {
  const cookies = new Cookies(req?.headers?.cookie);

  const language = cookies.get('udb-language') ?? 'nl';

  const url = new URL(`http://${req.headers.host}${req.url}`);

  const referer = new URL(url.searchParams.get('referer') ?? '');
  referer.searchParams.delete('jwt');

  req.headers.referer =
    referer.toString() || req.headers.referer || url.toString();

  return {
    redirect: {
      destination: `/login/${language}?referer=${req.headers.referer}`,
      permanent: false,
    },
  };
};

export default Index;
