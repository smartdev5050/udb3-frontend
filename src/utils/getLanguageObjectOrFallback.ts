import { SupportedLanguage, SupportedLanguages } from '../i18n';

const getLanguageObjectOrFallback = <TReturned>(
  obj: any,
  language: SupportedLanguage,
  mainLanguage?: SupportedLanguage,
) => {
  if (!obj) return;

  if (obj?.[language]) {
    return obj[language] as TReturned;
  }

  if (mainLanguage && obj[mainLanguage]) {
    return obj[mainLanguage] as TReturned;
  }

  // use nl as fallback language
  if (typeof obj !== 'string' && obj[SupportedLanguages.NL]) {
    return obj[SupportedLanguages.NL] as TReturned;
  }

  return obj as TReturned;
};

export { getLanguageObjectOrFallback };
