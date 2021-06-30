const createSortingArgument = (sortOptions: {
  field: string;
  order: string;
}) => {
  return { [`sort[${sortOptions.field}]`]: `${sortOptions.order}` };
};

export { createSortingArgument };
