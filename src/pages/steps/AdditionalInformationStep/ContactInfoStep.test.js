import { isValidUrl } from '@/utils/isValidInfo';

describe('isValidUrl', () => {
  const tests = {
    goobar: false,
    'goobar.com': false,
    'http://goobar.com': true,
    'https://speeltuin.vlaanderen/speeltuinen': true,
  };

  test.each(Object.entries(tests))('can check if url %p is %p', (url) =>
    expect(isValidUrl(url)).toBe(tests[url]),
  );
});
