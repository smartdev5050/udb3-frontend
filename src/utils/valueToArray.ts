const valueToArray = <T>(value: T): T[] => (!!value ? [value] : []);

export { valueToArray };
