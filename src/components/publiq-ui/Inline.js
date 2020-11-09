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

const StyledInline = styled(Box)`
  display: flex;
  flex-direction: row;

  ${parseProperty('alignItems')};
  ${parseProperty('justifyContent')};

  ${spacingProps}
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
  const layoutProps = getLayoutProps(props);

  console.log(layoutProps);

  const clonedChildren = Children.map(children, (child, i) =>
    cloneElement(child, {
      ...child.props,
      marginRight: i < children.length - 1 ? spacing : 0,
    }),
  );

  return (
    <StyledInline
      className={className}
      {...layoutProps}
      alignItems={alignItems}
      justifyContent={justifyContent}
      as={as}
    >
      {clonedChildren}
    </StyledInline>
  );
};

Inline.propTypes = {
  ...spacingPropTypes,
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
