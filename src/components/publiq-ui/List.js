import PropTypes from 'prop-types';
import { ListGroup } from 'react-bootstrap';

const List = ({ children, className }) => {
  return <ListGroup className={className}>{children}</ListGroup>;
};

List.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export { List };
