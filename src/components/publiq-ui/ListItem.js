import PropTypes from 'prop-types';
import { Inline, getInlineProps, inlinePropTypes } from './Inline';

const ListItem = ({ children, className, onClick, ...props }) => (
  <Inline
    as="li"
    tabIndex={0}
    className={className}
    onClick={onClick}
    {...getInlineProps(props)}
  >
    {children}
  </Inline>
);

ListItem.propTypes = {
  ...inlinePropTypes,
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

ListItem.defaultTypes = {
  onClick: () => {},
};

export { ListItem };
