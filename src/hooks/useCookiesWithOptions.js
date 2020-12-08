import { useCookies as useReactCookies } from 'react-cookie';

const useCookiesWithOptions = (
  dependencies = [],
  options = {
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  },
) => {
  const [cookies, setCookie, removeCookie] = useReactCookies(dependencies);

  const setCookieWithOptions = (name, value) => setCookie(name, value, options);
  const removeAuthenticationCookies = () =>
    ['token', 'user'].forEach(removeCookie);

  return {
    cookies,
    setCookie: setCookieWithOptions,
    removeCookie,
    removeAuthenticationCookies,
  };
};

export { useCookiesWithOptions };
