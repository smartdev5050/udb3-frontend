const prefixUrlWithHttps = (url: string) => {
  return url.replace(/(https?:\/\/)?(.+)/, 'https://$2');
};

export { prefixUrlWithHttps };
