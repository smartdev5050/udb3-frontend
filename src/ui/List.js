import PropTypes from 'prop-types';
import { Children } from 'react';

import { getInlineProps, Inline } from './Inline';
import { getStackProps, Stack } from './Stack';

const ListVariants = {
  ORDERED: 'ordered',
  UNORDERED: 'unordered',
};

const List = ({ children, className, variant, ...props }) => (
  <Stack
    forwardedAs={variant === ListVariants.ORDERED ? 'ol' : 'ul'}
    className={className}
    variant={variant}
    {...getStackProps(props)}
  >
    {children}
  </Stack>
);

List.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

List.defaultProps = {
  variant: ListVariants.UNORDERED,
};

const ListItem = ({ children, className, onClick, ...props }) => {
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

ListItem.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

List.Item = ListItem;

export { List };
