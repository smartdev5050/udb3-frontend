import get from 'lodash.get';

import nl from '../i18n/nl.json';
import fr from '../i18n/fr.json';

export default (context, inject) => {
  const defaultLanguage = 'nl';

  const cookieOptions = {
    maxAge: 60 * 60 * 24 * 7,
  };

  const languageInCookie = context.app.$cookies.get('udb-language');

  if (!languageInCookie) {
    context.app.$cookies.set('udb-language', defaultLanguage, cookieOptions);
  }

  const locales = {
    nl,
    fr,
  };

  const translate = (path) => {
    const languageInCookie = context.app.$cookies.get('udb-language');
    return get(locales[languageInCookie], path);
  };

  inject('t', translate);
};
