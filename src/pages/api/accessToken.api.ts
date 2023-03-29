import { getAccessToken } from '@auth0/nextjs-auth0';
import { CookieSerializeOptions, serialize } from 'cookie';

const fetchAccessToken = async (req, res) => {
  const defaultCookieOptions = {
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  };
  try {
    const { accessToken } = await getAccessToken(req, res);
    res.setHeader(
      'Set-Cookie',
      serialize('token', accessToken, defaultCookieOptions),
    );
    res.status(200).send();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

export default fetchAccessToken;
