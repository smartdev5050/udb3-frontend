import { useCookiesWithOptions } from './useCookiesWithOptions';

const useFeatureFlag = (identifier) => {
  if (!identifier) return [false, () => {}];

  const fullIdentifier = `ff_${identifier}`;

  const { cookies, setCookie } = useCookiesWithOptions();

  const set = (value) => setCookie(fullIdentifier, value);
  const value = cookies?.[fullIdentifier] ?? false;

  return [value, set];
};

export { useFeatureFlag };
