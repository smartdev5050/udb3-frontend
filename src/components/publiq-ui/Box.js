import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { kebabCase, pick } from 'lodash';
import { forwardRef } from 'react';

const remInPixels = 15;

const wrapStatementWithBreakpoint = (breakpoint, statementToWrap) => () => css`
  @media (max-width: ${breakpoint}px) {
    ${statementToWrap}
  }
`;

const createCSSStatement = (key, value, parser) => () => css`
  ${kebabCase(key)}: ${parser ? parser(value) : value};
`;

const parseProperty = (key, parser, customValue) => (props) => {
  if (key === undefined || key === null) return css``;
  const value = customValue || props[key];

  if (value === undefined) return css``;

  const parsedValue =
    typeof value === 'object' && value !== null ? value : { default: value };

  const { default: defaultValue, hover, ...rest } = parsedValue;

  const style = css`
    ${defaultValue && createCSSStatement(key, defaultValue, parser)}
    ${hover &&
    css`
      :hover {
        ${createCSSStatement(key, hover, parser)}
      }
    `}
  `;

  if (Object.keys(rest).length === 0) {
    return style;
  }

  const parsedBreakpoints = Object.entries(rest)
    .map(([breakpoint]) => [
      props?.theme?.breakpoints?.[breakpoint],
      parsedValue?.[breakpoint],
    ])
    .sort(([valueA], [valueB]) => valueA - valueB);

  return parsedBreakpoints.reduce((acc, [breakpoint, val], index) => {
    if (!breakpoint || val === undefined) return acc;
    return css`
      ${wrapStatementWithBreakpoint(
        breakpoint,
        createCSSStatement(key, val, parser),
      )};
      ${acc};
    `;
  }, style);
};

const parseSpacing = (value) => () => `${(1 / remInPixels) * 2 ** value}rem`;
const parseDimension = (value) => () =>
  typeof value === 'string' || value instanceof String ? value : `${value}px`;

const parseAnimation = (value) => () =>
  Array.isArray(value) ? value.join(', ') : value;

const parseShorthandProperty = (shorthand, propsToChange = [], parser) => (
  props,
) =>
  propsToChange.reduce(
    (acc, val) => css`
      ${parseProperty(val, parser, props[shorthand])};
      ${acc};
    `,
    css``,
  );

const boxProps = css`
  ${parseProperty('position')};

  ${parseShorthandProperty(
    'margin',
    ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'],
    parseSpacing,
  )};

  ${parseShorthandProperty(
    'marginY',
    ['marginTop', 'marginBottom'],
    parseSpacing,
  )};

  ${parseShorthandProperty(
    'marginX',
    ['marginLeft', 'marginRight'],
    parseSpacing,
  )};

  ${parseProperty('marginTop', parseSpacing)};
  ${parseProperty('marginBottom', parseSpacing)};
  ${parseProperty('marginLeft', parseSpacing)};
  ${parseProperty('marginRight', parseSpacing)};

  ${parseShorthandProperty(
    'padding',
    ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    parseSpacing,
  )};

  ${parseShorthandProperty(
    'paddingY',
    ['paddingTop', 'paddingBottom'],
    parseSpacing,
  )};
  ${parseShorthandProperty(
    'paddingX',
    ['paddingLeft', 'paddingRight'],
    parseSpacing,
  )};

  ${parseProperty('paddingTop', parseSpacing)};
  ${parseProperty('paddingBottom', parseSpacing)};
  ${parseProperty('paddingLeft', parseSpacing)};
  ${parseProperty('paddingRight', parseSpacing)};

  ${parseProperty('width', parseDimension)};
  ${parseProperty('maxWidth', parseDimension)};
  ${parseProperty('minWidth', parseDimension)};

  ${parseProperty('height', parseDimension)};
  ${parseProperty('maxHeight', parseDimension)};
  ${parseProperty('minHeight', parseDimension)};

  ${parseProperty('top', parseDimension)};
  ${parseProperty('bottom', parseDimension)};
  ${parseProperty('left', parseDimension)};
  ${parseProperty('right', parseDimension)};

  ${parseProperty('backgroundColor')};
  ${parseProperty('color')};
  ${parseProperty('zIndex')};

  ${parseProperty('opacity')};
  ${parseProperty('flex')};
  ${parseProperty('cursor')};

  ${parseProperty('animation', parseAnimation)}
`;

const StyledBox = styled.div`
  ${boxProps}
`;

const boxPropTypes = {
  margin: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  marginTop: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  marginBottom: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  marginRight: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  marginLeft: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  marginX: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  marginY: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  padding: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  paddingTop: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  paddingBottom: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  paddingRight: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  paddingLeft: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  paddingX: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  paddingY: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  minWidth: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  maxWidth: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  maxHeight: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  minHeight: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  top: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  bottom: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  left: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  right: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  backgroundColor: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
  ]),
  color: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
  ]),
  zIndex: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  position: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
  ]),
  opacity: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  flex: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  cursor: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
  ]),
  animation: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
  ]),
};

const getBoxProps = (props) => pick(props, Object.keys(boxPropTypes));

const Box = forwardRef(({ children, ...props }, ref) => (
  <StyledBox ref={ref} {...props}>
    {children}
  </StyledBox>
));

Box.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  ...boxPropTypes,
};

Box.defaultProps = {
  as: 'div',
};

export {
  Box,
  boxProps,
  boxPropTypes,
  getBoxProps,
  parseProperty,
  parseSpacing,
  parseDimension,
};
