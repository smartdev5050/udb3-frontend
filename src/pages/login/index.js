import { Cookies } from 'react-cookie';

const Index = () => null;

export const getServerSideProps = ({ req, params }) => {
  const cookies = new Cookies(req?.headers?.cookie);

  const language = cookies.get('udb-language') ?? 'nl';

  return {
    redirect: {
      destination: `/login/${language}`,
      permanent: true,
    },
  };
};

export default Index;
