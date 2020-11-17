import styled, { css } from 'styled-components';
import { Box, getBoxProps, boxProps, boxPropTypes, parseProperty } from './Box';
import PropTypes from 'prop-types';
import { Children, cloneElement } from 'react';
import { pick } from 'lodash';

const inlineProps = css`
  display: flex;
  flex-direction: row;

  ${parseProperty('alignItems')};
  ${parseProperty('justifyContent')};

  ${boxProps}
`;

const StyledBox = styled(Box)`
  ${inlineProps};
`;

const Inline = ({
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
        <Box as="p" marginRight={spacing}>
          {child}
        </Box>
      );

    // if child is html
    if (child.props.originalType) {
      return (
        <Box
          as={`${child.props.originalType}`}
          {...child.props}
          marginRight={spacing}
        />
      );
    }

    // if child is functional component
    return cloneElement(child, {
      ...child.props,
      ...(i < children.length - 1 ? { marginRight: spacing } : {}),
    });
  });

  return (
    <StyledBox className={className} as={as} {...getBoxProps(props)}>
      {clonedChildren}
    </StyledBox>
  );
};

const inlineProptypes = {
  ...boxPropTypes,
  spacing: PropTypes.number,
};

const getInlineProps = (props) => pick(props, Object.keys(inlineProptypes));

Inline.propTypes = {
  ...inlineProptypes,
  as: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  alignItems: PropTypes.string,
  justifyContent: PropTypes.string,
};

Inline.defaultProps = {
  as: 'section',
};

export { Inline, getInlineProps, inlineProptypes, inlineProps };
