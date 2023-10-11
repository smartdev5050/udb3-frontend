import { isValidUrl } from '@/utils/isValidInfo';

describe('isValidUrl', () => {
  const tests = {
    goobar: false,
    'goobar.com': false,
    'http://goobar': false,
    'http://goobar.com': true,
    'https://speeltuin.vlaanderen/speeltuinen': true,
    'https://speeltuin.vlaanderen/speeltuinen?foo[]=bar&baz=50': true,
  };

  test.each(Object.entries(tests))(
    'can check if url %p being valid is %p',
    (url, expected) => expect(isValidUrl(url)).toBe(expected),
  );
});
