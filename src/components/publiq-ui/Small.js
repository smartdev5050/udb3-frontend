import PropTypes from 'prop-types';
import styled from 'styled-components';
import { boxProps, boxPropTypes, getBoxProps } from './Box';

const StyledSmall = styled.small`
  font-size: 0.65rem;

  ${boxProps};
`;

const Small = ({ children, className, ...props }) => (
  <StyledSmall className={className} {...getBoxProps(props)}>
    {children}
  </StyledSmall>
);

Small.propTypes = {
  ...boxPropTypes,
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Small };
