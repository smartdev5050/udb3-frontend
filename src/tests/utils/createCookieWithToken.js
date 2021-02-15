import base64 from 'base-64';

const createCookieWithToken = () => {
  const header = base64.encode(JSON.stringify({ test: 'ok' }));
  const payload = base64.encode(
    // eslint-disable-next-line no-loss-of-precision
    JSON.stringify({ exp: 99999999999999999999999999999999999999999 }),
  );
  const token = [header, payload, 'SIGNATURE'].join('.');

  Object.defineProperty(window.document, 'cookie', {
    writable: true,
    value: `token=${token}`,
  });
};

export { createCookieWithToken };
