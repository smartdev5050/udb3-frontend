import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useCookiesWithOptions } from '../hooks/useCookiesWithOptions';
import { Button } from './publiq-ui/Button';

const LoginButton = ({ className }) => {
  const [, , removeCookie] = useCookiesWithOptions(['token', 'user']);
  const router = useRouter();

  const { i18n } = useTranslation();

  const getBaseUrl = () =>
    `${window.location.protocol}//${window.location.host}`;

  const removeCookies = () => {
    removeCookie('token');
    removeCookie('user');
  };

  const handleClickLogin = () => {
    removeCookies();

    const queryString = new URLSearchParams({
      destination: getBaseUrl,
      lang: i18n.language,
    }).toString();

    router.push(`${process.env.NEXT_PUBLIC_AUTH_URL}/connect?${queryString}`);
  };

  return (
    <Button className={className} onClick={handleClickLogin}>
      Login
    </Button>
  );
};

LoginButton.propTypes = {
  className: PropTypes.string,
};

export { LoginButton };
