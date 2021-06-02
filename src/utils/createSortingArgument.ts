const createSortingArgument = (sortOptions): { [field: string]: string } => {
  return { [`sort[${sortOptions.field}]`]: `${sortOptions.order}` };
};

export { createSortingArgument };
