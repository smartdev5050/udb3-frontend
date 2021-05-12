import type { SortOptions } from '@/hooks/api/types/SortOptions';

const createSortingArgument = (
  sortOptions: SortOptions,
): { [field: string]: string } => {
  return { [`sort[${sortOptions.field}]`]: `${sortOptions.order}` };
};

export { createSortingArgument };
