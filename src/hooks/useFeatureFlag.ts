import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { Values } from '@/types/Values';

import { useCookiesWithOptions } from './useCookiesWithOptions';

const FeatureFlags = {
  REACT_CREATE: 'react_create',
  ORGANIZER_CREATE: 'organizer_create',
} as const;

const createCookieName = (identifier: string) => `ff_${identifier}`;

type FeatureFlagName = Values<typeof FeatureFlags>;

const useFeatureFlag = (featureFlagName: FeatureFlagName) => {
  const cookieName = useMemo(
    () => createCookieName(featureFlagName),
    [featureFlagName],
  );

  const dependencies = useMemo(() => [cookieName], [cookieName]);

  const { cookies, setCookie } = useCookiesWithOptions(dependencies);

  const cookieValue = useMemo(
    () => isFeatureFlagEnabledInCookies(featureFlagName, cookies),
    [cookies, featureFlagName],
  );

  const [isFeatureEnabled, setIsFeatureEnabled] = useState(cookieValue);

  useEffect(() => {
    setIsFeatureEnabled(cookieValue);
  }, [cookieValue]);

  const set = useCallback<Dispatch<SetStateAction<boolean>>>(
    (val) => {
      const setValue = (newValue: boolean) => {
        setCookie(cookieName, newValue);
      };

      if (typeof val === 'function') {
        const updatedValue = val(cookieValue);

        setValue(updatedValue);
        return;
      }

      setValue(val);
    },
    [cookieName, cookieValue, setCookie],
  );

  const statePair = useMemo(
    () => [isFeatureEnabled, set] as const,
    [isFeatureEnabled, set],
  );

  return statePair;
};

const isFeatureFlagEnabledInCookies = (
  featureFlagName: FeatureFlagName,
  cookies: any,
) => {
  const cookieName = createCookieName(featureFlagName);
  return cookies?.[cookieName] === 'true';
};

export {
  createCookieName,
  FeatureFlags,
  isFeatureFlagEnabledInCookies,
  useFeatureFlag,
};
