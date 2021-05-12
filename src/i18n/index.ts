import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import fr from './fr.json';
import nl from './nl.json';

const supportedLanguages = ['nl', 'fr'] as const;
type SupportedLanguage = typeof supportedLanguages[number];

// eslint-disable-next-line @typescript-eslint/no-floating-promises
i18n.use(LanguageDetector);
i18n.use(initReactI18next);
i18n
  .init({
    resources: {
      fr: { translation: fr },
      nl: { translation: nl },
    },
    detection: { order: ['cookie'], lookupCookie: 'udb-language' },
    fallbackLng: 'nl',
    supportedLngs: [...supportedLanguages],
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('i18n initialized successfully');
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.log('i18n initialisation failed', error);
  });

export type { SupportedLanguage };
export default i18n;
