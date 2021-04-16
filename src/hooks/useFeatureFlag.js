import { useCookiesWithOptions } from './useCookiesWithOptions';

const FeatureFlags = {
  REACT_DASHBOARD: 'react_dashboard',
  REACT_CREATE: 'react_create',
};

const createCookieName = (identifier) => `ff_${identifier}`;

const useFeatureFlag = (featureFlagName) => {
  if (!featureFlagName) return [false, () => {}];

  const { cookies, setCookie } = useCookiesWithOptions();

  const cookieName = createCookieName(featureFlagName);

  const set = (value) => setCookie(cookieName, value);
  const value = isFeatureFlagEnabledInCookies(featureFlagName, cookies);

  return [value, set];
};

const isFeatureFlagEnabledInCookies = (featureFlagName, cookies) => {
  const cookieName = createCookieName(featureFlagName);
  return cookies?.[cookieName] === 'true' ?? false;
};

export {
  useFeatureFlag,
  createCookieName,
  isFeatureFlagEnabledInCookies,
  FeatureFlags,
};
