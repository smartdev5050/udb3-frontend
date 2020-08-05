import apiWrapper from '../api/api';

export default (context, inject) => {
  const api = apiWrapper(
    context.$config.authUrl,
    context.$config.apiUrl,
    context.$config.apiKey,
    () => context.app.$cookies.get('token'),
  );
  inject('api', api);
};
