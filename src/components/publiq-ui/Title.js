import PropTypes from 'prop-types';
import { Component } from 'react';
import styled from 'styled-components';
import { boxProps, boxPropTypes, getBoxProps } from './Box';

const StyledComponent = styled(Component)`
  &.h1 {
    font-weight: 300;
    font-size: 1.6rem;
  }

  &.h2 {
    font-weight: 700;
    font-size: 1.2rem;
  }

  ${boxProps};
`;

const Title = ({ size, children, className, ...props }) => (
  <StyledComponent
    className={`h${size} ${className || ''}`}
    as={`h${size}`}
    {...getBoxProps(props)}
  >
    {children}
  </StyledComponent>
);

Title.propTypes = {
  ...boxPropTypes,
  size: PropTypes.oneOf([1, 2]),
  className: PropTypes.string,
  children: PropTypes.node,
};

Title.defaultProps = {
  size: 2,
};

export { Title };
