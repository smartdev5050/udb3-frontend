const isFulfilledResult = <T>(
  res: PromiseSettledResult<T>,
): res is PromiseFulfilledResult<T> => {
  return res.status === 'fulfilled';
};

export { isFulfilledResult };
