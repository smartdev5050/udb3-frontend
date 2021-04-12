import { useCookiesWithOptions } from './useCookiesWithOptions';

const createCookieName = (identifier) => `ff_${identifier}`;

const useFeatureFlag = (featureFlagName) => {
  if (!featureFlagName) return [false, () => {}];

  const { cookies, setCookie } = useCookiesWithOptions();

  const cookieName = createCookieName(featureFlagName);

  const set = (value) => setCookie(cookieName, value);
  const value = cookies?.[cookieName] ?? false;

  return [value, set];
};

export { useFeatureFlag, createCookieName };
