import jwtDecode from 'jwt-decode';

import { getMe } from '../api/users';

export default async function (context) {
  const jwtInURL = context?.query?.jwt ?? '';

  const cookieOptions = {
    domain: 'localhost',
    maxAge: 60 * 60 * 24 * 7,
  };

  if (jwtInURL) {
    context.app.$cookies.set('token', jwtInURL, cookieOptions);
  }

  const jwtInCookie = context.app.$cookies.get('token');

  if (!jwtInCookie) {
    // Prevent redirecting to login when you're already on login
    if (context.route.path !== '/login') {
      window.location.href = '/login';
    }
    return;
  }

  const decodedJwt = jwtDecode(jwtInCookie);

  // TODO: error handling
  // TODO question why is the getMe necessary a lot of the info is already in the decoded JWT
  const user = await getMe(jwtInCookie)(decodedJwt.sub);

  context.app.$cookies.set('user', user, cookieOptions);
  context.app.$cookies.set('userPicture', decodedJwt.picture);
}
