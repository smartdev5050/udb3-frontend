import apiWrapper from '../api/api';

export default (context, inject) => {
  const api = apiWrapper(() => context.app.$cookies.get('token'));
  inject('api', api);
};
