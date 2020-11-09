import PropTypes from 'prop-types';
import { getLayoutProps } from './Box';
import { Stack, stackProps } from './Stack';

const List = ({ children, spacing, className, ...props }) => {
  const layoutProps = getLayoutProps(props);
  return (
    <Stack className={className} spacing={spacing} as="ul" {...layoutProps}>
      {children}
    </Stack>
  );
};

List.propTypes = {
  ...stackProps,
  className: PropTypes.string,
  children: PropTypes.node,
};

export { List };
