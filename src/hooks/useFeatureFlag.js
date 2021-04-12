import { FeatureFlags } from '@/constants/FeatureFlags';
import Cookies from 'universal-cookie';
import { useCookiesWithOptions } from './useCookiesWithOptions';

const cookies = new Cookies();

const createFullIdentifier = (identifier) => `ff_${identifier}`;

const useFeatureFlag = (identifier) => {
  if (!identifier) return [false, () => {}];

  const { cookies, setCookie } = useCookiesWithOptions();

  const fullIdentifier = createFullIdentifier(identifier);

  const set = (value) => setCookie(fullIdentifier, value);
  const value = cookies?.[fullIdentifier] ?? false;

  return [value, set];
};

if (typeof window !== 'undefined') {
  window.FeatureFlags = FeatureFlags;
  window.setFeatureFlag = (identifier, value) => {
    cookies.set(createFullIdentifier(identifier), value);
  };
}

export { useFeatureFlag };
