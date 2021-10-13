import { Children } from 'react';

import type { Values } from '@/types/Values';

import type { InlineProps } from './Inline';
import { getInlineProps, Inline } from './Inline';
import type { StackProps } from './Stack';
import { getStackProps, Stack } from './Stack';

const ListVariants = {
  ORDERED: 'ordered',
  UNORDERED: 'unordered',
} as const;

type ListProps = StackProps & {
  variant?: Values<typeof ListVariants>;
};

const List = ({ children, className, variant, ...props }: ListProps) => (
  <Stack
    as={variant === ListVariants.ORDERED ? 'ol' : 'ul'}
    className={className}
    variant={variant}
    {...getStackProps(props)}
  >
    {children}
  </Stack>
);

List.defaultProps = {
  variant: ListVariants.UNORDERED,
};

type ListItemProps = InlineProps;

const ListItem = ({
  children,
  className,
  onClick,
  ...props
}: ListItemProps) => {
  const parsedChildren =
    Children.count(children) === 1 ? <>{children}</> : children;

  return (
    <Inline
      as="li"
      className={className}
      onClick={onClick}
      {...getInlineProps(props)}
    >
      {parsedChildren}
    </Inline>
  );
};

List.Item = ListItem;

export type { ListItemProps, ListProps };
export { List, ListVariants };
