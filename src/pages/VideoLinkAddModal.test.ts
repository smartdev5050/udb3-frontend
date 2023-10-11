import { ALLOWED_VIDEO_SOURCES_REGEX } from '@/pages/VideoLinkAddModal';

describe('ALLOWED_VIDEO_SOURCES_REGEX', () => {
  const tests = {
    'https://www.youtube.com/watch?v=12345678901': true,
    'http://youtu.be/12345678901?si=6N2ks_X0YOE_0Pmg': true,
    'http://youtudbe/12345678901?si=6N2ks_X0YOE_0Pmg': false,
    'https://www.youtube.com/shorts/ViOS7SeT0HE': true,
    'https://vimeo.com/789006133': true,
    'http://www.vimeo.com/789006133': true,
    'http://miveo.com/789006133': false,
  };

  test.each(Object.entries(tests))(
    'can test whether video URL %p being valid is %p',
    (url, expected) =>
      expect(ALLOWED_VIDEO_SOURCES_REGEX.test(url)).toBe(expected),
  );
});
