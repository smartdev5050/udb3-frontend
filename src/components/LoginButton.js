import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';
import { Button } from './publiq-ui/Button';

const LoginButton = ({ language, className }) => {
  const [, , removeCookie] = useCookies(['token', 'user']);

  const buildBaseUrl = () =>
    `${window.location.protocol}//${window.location.host}`;

  const removeCookies = () => {
    removeCookie('token');
    removeCookie('user');
  };

  const handleClickLogin = () => {
    removeCookies();

    const queryString = new URLSearchParams({
      destination: buildBaseUrl(),
      lang: language,
    }).toString();

    console.log(process.env.AUTH_URL, process.env.API_URL);
    console.log(`${process.env.AUTH_URL}/connect?${queryString}`);

    window.location.href = `${process.env.AUTH_URL}/connect?${queryString}`;
  };

  return (
    <Button className={className} onClick={handleClickLogin}>
      Login
    </Button>
  );
};

LoginButton.propTypes = {
  language: PropTypes.oneOf(['nl', 'fr']).isRequired,
  className: PropTypes.string,
};

export { LoginButton };
