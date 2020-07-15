import apiWrapper from '../api/api';

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

  const api = apiWrapper(jwtInCookie);

  // TODO: error handling
  const user = await api.user.getMe();

  context.app.$cookies.set('user', user, cookieOptions);
}
