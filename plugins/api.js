import apiWrapper from '../api/api';

export default (context, inject) => {
  const jwtInCookie = context.app.$cookies.get('token');
  const api = apiWrapper(jwtInCookie);
  inject('api', api);
};
