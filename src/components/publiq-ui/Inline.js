import styled from 'styled-components';
import { Box, getBoxProps, boxProps, boxPropTypes, parseProperty } from './Box';
import PropTypes from 'prop-types';
import { Children, cloneElement } from 'react';

const StyledInline = styled(Box)`
  display: flex;
  flex-direction: row;

  ${parseProperty('alignItems')};
  ${parseProperty('justifyContent')};

  ${boxProps}
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
  const clonedChildren = Children.map(children, (child, i) =>
    cloneElement(child, {
      ...child.props,
      ...(i < children.length - 1 ? { marginRight: spacing } : {}),
    }),
  );

  return (
    <StyledInline
      className={className}
      {...getBoxProps(props)}
      alignItems={alignItems}
      justifyContent={justifyContent}
      as={as}
    >
      {clonedChildren}
    </StyledInline>
  );
};

Inline.propTypes = {
  ...boxPropTypes,
  as: PropTypes.string,
  spacing: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.node,
  alignItems: PropTypes.string,
  justifyContent: PropTypes.string,
};

Inline.defaultProps = {
  as: 'section',
};

export { Inline };
