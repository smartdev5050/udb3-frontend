import styled, { css } from 'styled-components';
import { Box, getLayoutProps, spacingProps, spacingPropTypes } from './Box';
import PropTypes from 'prop-types';
import { kebabCase } from 'lodash';
import { Children, cloneElement } from 'react';

const parseProperty = (key) => (props) => {
  const value = props[key];
  if (key === undefined || key === null) return;

  const cssProperty = kebabCase(key);

  return css`
    ${cssProperty}: ${value};
  `;
};

const StyledStack = styled(Box)`
  display: flex;
  flex-direction: column;

  ${parseProperty('alignItems')};
  ${parseProperty('justifyContent')};

  ${spacingProps}
`;

const Stack = ({ spacing, className, children, as, ...props }) => {
  const layoutProps = getLayoutProps(props);

  const clonedChildren = Children.map(children, (child, i) =>
    cloneElement(child, {
      ...child.props,
      marginBottom: i < children.length - 1 ? spacing : 0,
    }),
  );

  return (
    <StyledStack className={className} {...layoutProps} as={as}>
      {clonedChildren}
    </StyledStack>
  );
};

export const stackProps = {
  ...spacingPropTypes,
  spacing: PropTypes.number,
};

Stack.propTypes = {
  ...stackProps,
  as: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  alignItems: PropTypes.string,
  justifyContent: PropTypes.string,
};

Stack.defaultProps = {
  as: 'section',
};

export { Stack };
