import { getYoutubeThumbnailUrl } from '@/pages/steps/AdditionalInformationStep/MediaStep';

describe('getYoutubeThumbnailUrl', () => {
  it.each([
    [
      'https://www.youtube.com/shorts/rqI3xF9vDd0',
      'https://img.youtube.com/vi_webp/rqI3xF9vDd0/maxresdefault.webp',
    ],
    [
      'https://www.youtube.com/watch?v=vGg8F_ACay8',
      'https://img.youtube.com/vi_webp/vGg8F_ACay8/maxresdefault.webp',
    ],
    [
      'https://youtu.be/vGg8F_ACay8?si=ErBmZt5vrcCm4BsB',
      'https://img.youtube.com/vi_webp/vGg8F_ACay8/maxresdefault.webp',
    ],
  ])(`should get thumbnail from %s`, (url, thumbnail) => {
    expect(getYoutubeThumbnailUrl(url)).toEqual(thumbnail);
  });
});
