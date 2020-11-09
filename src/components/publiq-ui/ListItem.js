import PropTypes from 'prop-types';
import { ListGroup } from 'react-bootstrap';
import { spacingPropTypes } from './Box';

const ListItem = ({ children, className, onClick, ...props }) => (
  <ListGroup.Item
    tabIndex={0}
    className={className}
    onClick={onClick}
    as="li"
    {...props}
  >
    {children}
  </ListGroup.Item>
);

ListItem.propTypes = {
  ...spacingPropTypes,
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

ListItem.defaultTypes = {
  onClick: () => {},
};

export { ListItem };
