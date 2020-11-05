import PropTypes from 'prop-types';
import { ListGroup } from 'react-bootstrap';

const ListItem = ({ children, className, onClick }) => {
  return (
    <ListGroup.Item tabIndex={0} className={className} onClick={onClick}>
      {children}
    </ListGroup.Item>
  );
};

ListItem.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

export { ListItem };
