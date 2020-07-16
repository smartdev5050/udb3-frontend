import i18next from 'i18next';

import nl from '../i18n/nl.json';
import fr from '../i18n/fr.json';

export default (context, inject) => {
  const defaultLanguage = 'nl';

  const cookieConfiguration = {
    name: 'udb-language',
    options: {
      maxAge: 60 * 60 * 24 * 7,
    },
  };

  let languageInCookie = context.app.$cookies.get(cookieConfiguration.name);

  if (!languageInCookie) {
    context.app.$cookies.set(
      cookieConfiguration.name,
      defaultLanguage,
      cookieConfiguration.options,
    );
    languageInCookie = context.app.$cookies.get(cookieConfiguration.name);
  }

  const resources = {
    nl: {
      translation: nl,
    },
    fr: {
      translation: fr,
    },
  };

  i18next.init({
    lng: languageInCookie,
    resources,
  });

  i18next.on('languageChanged', (language) => {
    context.app.$cookies.set(
      cookieConfiguration.name,
      language,
      cookieConfiguration.options,
    );
  });

  inject('i18n', i18next);
};
