import styled, { css } from 'styled-components';
import { Box, getBoxProps, boxProps, boxPropTypes, parseProperty } from './Box';
import PropTypes from 'prop-types';
import { Children, cloneElement } from 'react';
import { pick } from 'lodash';

const stackProps = css`
  display: flex;
  flex-direction: column;

  ${parseProperty('alignItems')};
  ${parseProperty('justifyContent')};

  ${boxProps}
`;

const StyledStack = styled(Box)`
  ${stackProps}
`;

const Stack = ({ spacing, className, children, as, ...props }) => {
  const clonedChildren = Children.map(children, (child, i) =>
    cloneElement(child, {
      ...child.props,
      ...(i < children.length - 1 ? { marginBottom: spacing } : {}),
    }),
  );

  return (
    <StyledStack className={className} as={as} {...getBoxProps(props)}>
      {clonedChildren}
    </StyledStack>
  );
};

const stackPropTypes = {
  ...boxPropTypes,
  spacing: PropTypes.number,
};

const getStackProps = (props) => pick(props, Object.keys(stackPropTypes));

Stack.propTypes = {
  ...stackPropTypes,
  as: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  alignItems: PropTypes.string,
  justifyContent: PropTypes.string,
};

Stack.defaultProps = {
  as: 'section',
};

export { Stack, getStackProps, stackPropTypes, stackProps };
