import { getMe } from '../api/users';

export default async function (context) {
  const jwtInURL = context?.query?.jwt ?? '';

  const cookieOptions = {
    maxAge: 60 * 60 * 24 * 7,
  };

  if (jwtInURL) {
    context.app.$cookies.set('token', jwtInURL, cookieOptions);
  }

  const jwtInCookie = context.app.$cookies.get('token');

  if (!jwtInCookie) {
    // Prevent redirecting to login when you're already on login
    if (context.route.path !== '/login') {
      context.redirect('/login');
    }
    return;
  }

  // TODO: error handling
  const user = await getMe(jwtInCookie);

  context.app.$cookies.set('user', user, cookieOptions);
}
