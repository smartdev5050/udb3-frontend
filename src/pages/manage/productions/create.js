import { Cookies } from 'react-cookie';
import { Title } from '../../../components/publiq-ui/Title';

const Create = () => {
  return <Title>Productions - create</Title>;
};

export const getServerSideProps = async ({ req, query }) => {
  const { cookies } = new Cookies(req?.headers?.cookie);
  const isUnAuthorized = !cookies.token && !query?.jwt;

  if (isUnAuthorized) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      cookies,
    },
  };
};

export default Create;
