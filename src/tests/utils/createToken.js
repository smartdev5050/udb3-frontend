import base64 from 'base-64';

const createToken = () => {
  const header = base64.encode(JSON.stringify({ test: 'ok' }));
  const payload = base64.encode(
    // eslint-disable-next-line no-loss-of-precision
    JSON.stringify({ exp: 99999999999999999999999999999999999999999 }),
  );
  return [header, payload, 'SIGNATURE'].join('.');
};

export { createToken };
