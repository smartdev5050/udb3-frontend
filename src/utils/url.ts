const prefixUrlWithHttp = (url: string) => {
  if (!url.startsWith('http')) return url;

  return `http://${url}`;
};

export { prefixUrlWithHttp };
