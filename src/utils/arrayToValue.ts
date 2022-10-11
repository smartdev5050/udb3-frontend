const arrayToValue = <T>(value: T[] | T): T =>
  Array.isArray(value) ? value.at(0) : value;

export { arrayToValue };
