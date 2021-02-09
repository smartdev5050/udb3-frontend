import { fetchFromApi } from './fetchFromApi';

describe('fetchFromApi', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('triggers a call with the correct URL', async () => {
    const data = { data: '12345' };
    fetch.mockResponseOnce(JSON.stringify(data));

    const response = await fetchFromApi({ path: '/random' });
    const result = await response.json();

    const calls = fetch.mock.calls;
    const [url] = calls[0];

    expect(calls.length).toStrictEqual(1);
    expect(url).toStrictEqual('http://localhost:3000/random');

    expect(result).toStrictEqual(data);
  });

  it('triggers a call with the correct params', async () => {
    const data = { data: '12345' };
    fetch.mockResponseOnce(JSON.stringify(data));

    const response = await fetchFromApi({
      path: '/random',
      searchParams: { foo: 'bar', id: 2 },
    });
    const result = await response.json();

    const calls = fetch.mock.calls;
    const [url] = calls[0];

    expect(calls.length).toStrictEqual(1);
    expect(url).toStrictEqual('http://localhost:3000/random?foo=bar&id=2');

    expect(result).toStrictEqual(data);
  });

  it('passes down options', async () => {
    const data = { data: '12345' };
    const method = 'PUT';
    const headers = {
      token: 'random',
    };

    fetch.mockResponseOnce(JSON.stringify(data));

    const response = await fetchFromApi({
      path: '/random',
      options: { method, headers },
    });
    const result = await response.json();

    const calls = fetch.mock.calls;
    const [url, options] = calls[0];

    expect(fetch.mock.calls.length).toStrictEqual(1);
    expect(url).toStrictEqual('http://localhost:3000/random');
    expect(options).toStrictEqual({ headers, method });

    expect(result).toStrictEqual(data);
  });

  it('throws error on invalid URL', async () => {
    await expect(
      fetchFromApi({
        path: true,
      }),
    ).rejects.toThrowError('Invalid URL: http://localhost:3000true');
  });

  it('returns error on invalid URL (silentError mode)', async () => {
    await expect(
      fetchFromApi({
        path: true,
        silentError: true,
      }),
    ).resolves.toStrictEqual({
      message: 'Invalid URL: http://localhost:3000true',
      type: 'ERROR',
    });
  });
  it('throws error on fetch error', async () => {
    const message = 'This is an error';
    fetch.mockReject(new Error(message));

    await expect(
      fetchFromApi({
        path: '/random',
      }),
    ).rejects.toThrowError(message);
  });

  it('returns error on fetch error (silentError mode)', async () => {
    const message = 'This is an error';
    fetch.mockReject(new Error(message));

    await expect(
      fetchFromApi({
        path: '/random',
        silentError: true,
      }),
    ).resolves.toStrictEqual({
      message: message,
      type: 'ERROR',
    });
  });

  it('throws error on not ok response', async () => {
    const message = 'This is an error';
    fetch.mockResponseOnce(JSON.stringify({ title: message }), { status: 400 });

    await expect(
      fetchFromApi({
        path: '/random',
      }),
    ).rejects.toThrowError(message);
  });

  it('returns error on not ok response (silentError mode)', async () => {
    const message = 'This is an error';
    fetch.mockResponseOnce(JSON.stringify({ title: message }), { status: 400 });

    await expect(
      fetchFromApi({ path: '/random', silentError: true }),
    ).resolves.toStrictEqual({
      message: message,
      status: 400,
      type: 'ERROR',
    });
  });
});
