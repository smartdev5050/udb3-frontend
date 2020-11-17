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

const StyledBox = styled(Box)`
  ${stackProps}
`;

const Stack = ({
  spacing,
  className,
  children,
  as,
  alignItems,
  justifyContent,
  ...props
}) => {
  const clonedChildren = Children.map(children, (child, i) => {
    // if child is normal text
    if (typeof child === 'string')
      return (
        <Box as="p" marginBottom={spacing}>
          {child}
        </Box>
      );

    // if child is html
    if (child.props.originalType) {
      return (
        <Box
          as={`${child.props.originalType}`}
          {...child.props}
          marginBottom={spacing}
        />
      );
    }

    // if child is functional component
    return cloneElement(child, {
      ...child.props,
      ...(i < children.length - 1 ? { marginBottom: spacing } : {}),
    });
  });

  return (
    <StyledBox className={className} as={as} {...getBoxProps(props)}>
      {clonedChildren}
    </StyledBox>
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
