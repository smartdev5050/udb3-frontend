import PropTypes from 'prop-types';
import { Component } from 'react';
import styled from 'styled-components';

const StyledComponent = styled(Component)`
  &.h1 {
    font-weight: 300;
    font-size: 1.6rem;
    margin: 0;
  }

  &.h2 {
    font-weight: 700;
    font-size: 1.2rem;
    margin: 0;
  }
`;

const Title = ({ size, children, className }) => (
  <StyledComponent className={`h${size} ${className || ''}`} as={`h${size}`}>
    {children}
  </StyledComponent>
);

Title.propTypes = {
  size: PropTypes.oneOf([1, 2]),
  className: PropTypes.string,
  children: PropTypes.node,
};

Title.defaultProps = {
  size: 2,
};

export { Title };
