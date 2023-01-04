import { SupportedLanguage } from '../i18n';

const getLanguageObjectOrFallback = <TReturned>(
  obj: any,
  language: SupportedLanguage,
  mainLanguage?: SupportedLanguage,
) => {
  if (obj[language]) {
    return obj[language] as TReturned;
  }

  if (mainLanguage && obj[mainLanguage]) {
    return obj[mainLanguage] as TReturned;
  }

  return obj as TReturned;
};

export { getLanguageObjectOrFallback };
