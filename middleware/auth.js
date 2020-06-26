import jwtDecode from 'jwt-decode'

import { getMe } from '../api/users'

export default async function (context) {
  const jwtInURL = context?.query?.jwt ?? ''

  const cookieOptions = {
    domain: 'localhost',
    maxAge: 60 * 60 * 24 * 7,
  }

  if (jwtInURL) {
    context.app.$cookies.set('token', jwtInURL, cookieOptions)
  }

  const jwtInCookie = context.app.$cookies.get('token')

  if (!jwtInCookie) {
    return context.redirect('/login')
  }

  const decodedJwt = jwtDecode(jwtInCookie)

  // TODO: error handling
  const user = await getMe(jwtInCookie)(decodedJwt.sub)

  context.app.$cookies.set('user', user, cookieOptions)
}
