import { Cookies } from 'react-cookie';

const Index = () => null;

export const getServerSideProps = ({ req, params }) => {
  const cookies = new Cookies(req?.headers?.cookie);

  let language = 'nl';
  if (cookies.get('udb-language')) {
    language = cookies.get('udb-language');
  }

  return {
    redirect: {
      destination: `/login/${language}`,
      permanent: true,
    },
  };
};

export default Index;
