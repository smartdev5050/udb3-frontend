import { useCookies as useReactCookies } from 'react-cookie';
import type { CookieSetOptions } from 'universal-cookie';

import type { User } from '@/types/User';

const defaultCookieOptions = {
  maxAge: 60 * 60 * 24 * 30,
  path: '/',
};

type Cookies = {
  'udb-language'?: string;
  user?: User;
  token?: string;
};

type SetCookie = (name: string, value: any, options?: CookieSetOptions) => void;
type RemoveCookie = (name: string, options?: CookieSetOptions) => void;

const useCookiesWithOptions = (
  dependencies: string[] = [],
  options: CookieSetOptions = defaultCookieOptions,
) => {
  const [cookies, setCookie, removeCookie]: [
    Cookies,
    SetCookie,
    RemoveCookie,
  ] = useReactCookies(dependencies);

  const setCookieWithOptions = (name: string, value: any) =>
    setCookie(name, value, options);
  const removeAuthenticationCookies = () =>
    ['token', 'user'].forEach((cookie) => removeCookie(cookie));

  return {
    cookies,
    setCookie: setCookieWithOptions,
    removeCookie,
    removeAuthenticationCookies,
  };
};

export { defaultCookieOptions, useCookiesWithOptions };
