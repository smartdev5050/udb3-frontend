import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import { Box } from './publiq-ui/Box';
import { Button } from './publiq-ui/Button';

const LoginButton = ({ className }) => {
  const [, , removeCookie] = useCookies(['token', 'user']);

  const { i18n } = useTranslation();

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
      lang: i18n.language,
    }).toString();

    window.location.href = `${process.env.NEXT_PUBLIC_AUTH_URL}/connect?${queryString}`;
  };

  return (
    <Button className={className} onClick={handleClickLogin}>
      <Box as="span">Login</Box>
    </Button>
  );
};

LoginButton.propTypes = {
  className: PropTypes.string,
};

export { LoginButton };
