import { useCookies } from 'react-cookie';
import { LoginButton } from '../../components/LoginButton';

const Nl = () => {
  const cookieOptions = {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  };
  const [, setCookie] = useCookies(['udb-language']);
  setCookie('udb-language', 'nl', cookieOptions);

  return (
    <div>
      <LoginButton language="nl" />
    </div>
  );
};

export default Nl;
