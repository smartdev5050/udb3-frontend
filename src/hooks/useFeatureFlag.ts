import { useEffect, useMemo, useState } from 'react';

import type { Values } from '@/types/Values';

import { useCookiesWithOptions } from './useCookiesWithOptions';

const FeatureFlags = {
  REACT_CREATE: 'react_create',
} as const;

const createCookieName = (identifier: string) => `ff_${identifier}`;

type FeatureFlagName = Values<typeof FeatureFlags>;

const useFeatureFlag = (featureFlagName: FeatureFlagName) => {
  if (!featureFlagName) {
    throw new Error('You should provide a feature flag name');
  }

  const cookieName = useMemo(
    () => createCookieName(featureFlagName),
    [featureFlagName],
  );

  const dependencies = useMemo(() => [cookieName], [cookieName]);

  const { cookies, setCookie } = useCookiesWithOptions(dependencies);

  const [isFeatureEnabled, setIsFeatureEnabled] = useState(
    isFeatureFlagEnabledInCookies(featureFlagName, cookies),
  );

  const isCookieEnabled = useMemo(
    () => isFeatureFlagEnabledInCookies(featureFlagName, cookies),
    [cookies, featureFlagName],
  );

  useEffect(() => {
    setCookie(cookieName, isFeatureEnabled);
  }, [cookieName, featureFlagName, isFeatureEnabled, setCookie]);

  return [isCookieEnabled, setIsFeatureEnabled] as const;
};

const isFeatureFlagEnabledInCookies = (
  featureFlagName: FeatureFlagName,
  cookies: any,
) => {
  const cookieName = createCookieName(featureFlagName);
  return cookies?.[cookieName] === 'true' || false;
};

export {
  createCookieName,
  FeatureFlags,
  isFeatureFlagEnabledInCookies,
  useFeatureFlag,
};
