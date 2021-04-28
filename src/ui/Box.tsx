import styled, { css, ThemeProps } from 'styled-components';
import kebabCase from 'lodash/kebabCase';
import pick from 'lodash/pick';
import { ComponentType, forwardRef } from 'react';

type UIProp<T> = T | (() => T) | { [key: string]: T };

type Theme = {
  breakpoints: unknown;
};

type BoxProps = {
  alignItems: UIProp<string>;
  as: string | ComponentType<any>;
  margin: UIProp<number>;
  marginTop: UIProp<number>;
  marginBottom: UIProp<number>;
  marginRight: UIProp<number>;
  marginLeft: UIProp<number>;
  marginX: UIProp<number>;
  marginY: UIProp<number>;
  padding: UIProp<number>;
  paddingTop: UIProp<number>;
  paddingBottom: UIProp<number>;
  paddingRight: UIProp<number>;
  paddingLeft: UIProp<number>;
  paddingX: UIProp<number>;
  paddingY: UIProp<number>;
  width: UIProp<string | number>;
  minWidth: UIProp<string | number>;
  maxWidth: UIProp<string | number>;
  height: UIProp<string | number>;
  justifyContent: UIProp<string>;
  maxHeight: UIProp<string | number>;
  minHeight: UIProp<string | number>;
  top: UIProp<string | number>;
  bottom: UIProp<string | number>;
  left: UIProp<string | number>;
  right: UIProp<string | number>;
  backgroundColor: UIProp<string>;
  backgroundPosition: UIProp<string>;
  backgroundRepeat: UIProp<string>;
  objectFit: UIProp<string>;
  fontSize: UIProp<string | number>;
  fontWeight: UIProp<string | number>;
  textAlign: UIProp<string>;
  lineHeight: UIProp<string | number>;
  color: UIProp<string>;
  stroke: UIProp<string>;
  zIndex: UIProp<number>;
  position: UIProp<string>;
  display: UIProp<string>;
  opacity: UIProp<number>;
  flex: UIProp<string | number>;
  cursor: UIProp<string>;
  animation: UIProp<string>;
} & ThemeProps<Theme>;

type AvailableProps = keyof BoxProps;

type Parser = (value: unknown) => (props?: BoxProps) => string | number;

const remInPixels = 15;

const wrapStatementWithBreakpoint = (
  breakpoint: string,
  statementToWrap: string | (() => string),
) => () => css`
  @media (max-width: ${breakpoint}px) {
    ${statementToWrap}
  }
`;

const createCSSStatement = (
  key: AvailableProps,
  value: unknown,
  parser: Parser,
) => () => `
  ${kebabCase(key)}: ${parser ? parser(value) : String(value)};
`;

type UIPropObject = {
  default?: unknown;
  hover?: unknown;
};

const isUIPropObject = (value: unknown): value is UIPropObject => {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return true;
  }
  return false;
};

const parseProperty = (
  key: AvailableProps,
  parser?: Parser,
  customValue?: unknown,
) => (props: BoxProps) => {
  const value = customValue ?? props[key];
  if (value === undefined) return css``;

  const parsedValue = isUIPropObject(value) ? value : { default: value };

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

const parseSpacing = (value: number) => () =>
  `${(1 / remInPixels) * 2 ** value}rem`;

const isString = (value: unknown): value is string => {
  if (typeof value === 'string' || value instanceof String) return true;
  return false;
};

const parseDimension = (value: unknown) => () => {
  if (isString(value)) {
    return `${value}px`;
  }
  return Number(value);
};

const parseShorthandProperty = (
  shorthand: AvailableProps,
  propsToChange: AvailableProps[],
  parser: Parser,
) => (props: BoxProps) =>
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
  ${parseProperty('backgroundPosition')};
  ${parseProperty('backgroundRepeat')};

  ${parseProperty('objectFit')};

  ${parseProperty('fontSize')};
  ${parseProperty('fontWeight')};
  ${parseProperty('textAlign')};
  ${parseProperty('justifyContent')};
  ${parseProperty('alignItems')};
  ${parseProperty('lineHeight')};
  ${parseProperty('color')};
  ${parseProperty('stroke')};
  ${parseProperty('zIndex')};

  ${parseProperty('display')};
  ${parseProperty('opacity')};
  ${parseProperty('flex')};
  ${parseProperty('cursor')};

  ${parseProperty('animation')}
`;

const StyledBox = styled.div`
  ${boxProps}
`;

const boxPropTypes = [
  'alignItems',
  'as',
  'onClick',
  'margin',
  'marginTop',
  'marginBottom',
  'marginRight',
  'marginLeft',
  'marginX',
  'marginY',
  'padding',
  'paddingTop',
  'paddingBottom',
  'paddingRight',
  'paddingLeft',
  'paddingX',
  'paddingY',
  'width',
  'minWidth',
  'maxWidth',
  'height',
  'justifyContent',
  'maxHeight',
  'minHeight',
  'top',
  'bottom',
  'left',
  'right',
  'backgroundColor',
  'backgroundPosition',
  'backgroundRepeat',
  'objectFit',
  'fontSize',
  'fontWeight',
  'textAlign',
  'lineHeight',
  'color',
  'stroke',
  'zIndex',
  'position',
  'display',
  'opacity',
  'flex',
  'cursor',
  'animation',
] as const;

const getBoxProps = (props: unknown) => pick(props, boxPropTypes);

const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ children, ...props }, ref) => (
    <StyledBox ref={ref} {...props}>
      {children}
    </StyledBox>
  ),
);

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
