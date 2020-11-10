import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getBoxProps } from './Box';
import { Stack, stackProps } from './Stack';

const StyledStack = styled(Stack)`
  li:not(:last-child) {
    border-bottom: none;
  }
`;

const List = ({ children, spacing, className, ...props }) => {
  return (
    <StyledStack
      className={className}
      spacing={spacing}
      as="ul"
      {...getBoxProps(props)}
    >
      {children}
    </StyledStack>
  );
};

List.propTypes = {
  ...stackProps,
  className: PropTypes.string,
  children: PropTypes.node,
};

export { List };
