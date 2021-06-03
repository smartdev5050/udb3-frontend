import absoluteUrl from 'next-absolute-url';
import { Cookies } from 'react-cookie';

const Index = () => null;

export const getServerSideProps = ({ req, resolvedUrl }) => {
  const cookies = new Cookies(req?.headers?.cookie);

  const language = cookies.get('udb-language') ?? 'nl';

  const { origin } = absoluteUrl(req);

  const url = new URL(`${origin}${resolvedUrl}`);

  const referer = url.searchParams.get('referer')
    ? new URL(url.searchParams.get('referer'))
    : undefined;

  referer?.searchParams?.delete('jwt');

  req.headers.referer =
    referer?.toString() ?? (req.headers.referer || url.toString());

  return {
    redirect: {
      destination: `/login/${language}?referer=${req.headers.referer}`,
      permanent: false,
    },
  };
};

export default Index;
