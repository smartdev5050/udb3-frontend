import Cookie from 'cookie-universal';
const cookies = Cookie();

export const setLanguage = (language) => {
  const cookieOptions = {
    maxAge: 60 * 60 * 24 * 7,
  };

  cookies.set('udb-language', language, cookieOptions);
};
