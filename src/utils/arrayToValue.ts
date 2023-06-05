const arrayToValue = <T>(value: T[] | T): T =>
  Array.isArray(value) ? value[0] : value;

export { arrayToValue };
