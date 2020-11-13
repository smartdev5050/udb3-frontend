import { useCookies } from 'react-cookie';
import { LoginButton } from '../../components/LoginButton';

const Fr = () => {
  const cookieOptions = {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  };
  const [, setCookie] = useCookies(['udb-language']);
  setCookie('udb-language', 'fr', cookieOptions);

  return (
    <div>
      <LoginButton language="fr" />
    </div>
  );
};

export default Fr;
