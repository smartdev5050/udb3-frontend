import type { Values } from '@/types/Values';

import { useCookiesWithOptions } from './useCookiesWithOptions';

const FeatureFlags = {
  REACT_CREATE: 'react_create',
} as const;

const createCookieName = (identifier: string) => `ff_${identifier}`;

type FeatureFlagName = Values<typeof FeatureFlags>;

const useFeatureFlag = (
  featureFlagName: FeatureFlagName,
): [isEnabled: boolean, setIsEnabled: (value: boolean | string) => void] => {
  if (!featureFlagName) return [false, () => {}];

  const { cookies, setCookie } = useCookiesWithOptions();

  const cookieName = createCookieName(featureFlagName);

  const set = (value: boolean | string) => setCookie(cookieName, value);
  const isEnabled = isFeatureFlagEnabledInCookies(featureFlagName, cookies);

  return [isEnabled, set];
};

const isFeatureFlagEnabledInCookies = (
  featureFlagName: FeatureFlagName,
  cookies: any,
) => {
  const cookieName = createCookieName(featureFlagName);
  return cookies?.[cookieName] === 'true' ?? false;
};

export {
  createCookieName,
  FeatureFlags,
  isFeatureFlagEnabledInCookies,
  useFeatureFlag,
};
