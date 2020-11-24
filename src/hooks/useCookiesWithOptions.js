import { useCookies as useReactCookies } from 'react-cookie';

const useCookiesWithOptions = (dependencies = []) => {
  const [cookies, setCookie, removeCookie] = useReactCookies(dependencies);
  const setCookieWithOptions = (name, value) =>
    setCookie(name, value, {
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
  return [cookies, setCookieWithOptions, removeCookie];
};

export { useCookiesWithOptions };
