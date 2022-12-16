type EmptyObject = Record<string, never>;

const isEmptyObject = (val: Record<string, unknown>): val is EmptyObject => {
  return Object.keys(val).length === 0;
};

export type { EmptyObject };
export { isEmptyObject };
