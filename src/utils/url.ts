const prefixUrlWithHttps = (url: string) => {
  if (url.startsWith('https://')) return url;

  if (url.startsWith('http://')) {
    const httpsUrl = url.replace('http://', 'https://');
    return httpsUrl;
  }

  return `https://${url}`;
};

export { prefixUrlWithHttps };
