const useEventListenerOnMediaQuery = (mediaQuery, event, handler) => {
  if (!mediaQuery.addEventListener) {
    return mediaQuery.addListener(handler);
  }
  mediaQuery.addEventListener(event, handler);
};

export { useEventListenerOnMediaQuery };
