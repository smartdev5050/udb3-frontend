import base64 from 'base-64';

const isTokenValid = (token) => {
  if (!token) return false;
  const keys = ['header', 'payload', 'signature'];

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  let decodedToken;

  try {
    decodedToken = parts.reduce((token, part, index) => {
      if (!part) throw new Error('');
      const data = index < 2 ? JSON.parse(base64.decode(part)) : part;
      return { ...token, [keys[index]]: data };
    }, {});
  } catch {
    return false;
  }

  if (
    !decodedToken?.payload?.exp ||
    Date.now() >= decodedToken.payload.exp * 1000
  ) {
    return false;
  }

  return true;
};

export { isTokenValid };
