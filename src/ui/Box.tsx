import kebabCase from 'lodash/kebabCase';
import pick from 'lodash/pick';
import type {
  ChangeEvent,
  ComponentType,
  FormEvent,
  MouseEvent,
  ReactNode,
} from 'react';
import { forwardRef } from 'react';
import type {
  FlattenInterpolation,
  FlattenSimpleInterpolation,
  ThemeProps,
} from 'styled-components';
import styled, { css } from 'styled-components';

import type { BreakpointValues, Theme } from './theme';

type ValidUIPropTypes = string | number;

type UnknownProps = { [key: string]: any } & { theme?: Theme };

type UIPropValue<T> = T | ((props: ThemeProps<Theme>) => T);

type Parser = (
  value: UIPropValue<ValidUIPropTypes>,
) => (props?: ThemeProps<Theme>) => string;

type UIPropObject<T> = {
  default?: UIPropValue<T>;
  hover?: UIPropValue<T>;
} & {
  [value in BreakpointValues]?: UIPropValue<T>;
};

type UIProp<T> = UIPropValue<T> | UIPropObject<T>;

type GeneralProps = {
  theme: Theme;
  children: ReactNode;
  className: string;
  as: string | ComponentType<any>;
  forwardedAs: string | ComponentType<any>;
};

type InlineProps = {
  stackOn: BreakpointValues;
};

type TitleProps = {
  size: 1 | 2;
};

type ListProps = {
  variant: string;
};

type LinkProps = {
  title: string;
  href: string;
  rel: string;
  target: string;
};

type LabelProps = {
  htmlFor: string;
};

type ImageProps = {
  src: string;
  alt: string;
};

type SvgProps = {
  version: string;
  xmlns: string;
  viewBox: string;
};

type BoxProps = Partial<
  GeneralProps &
    InlineProps &
    TitleProps &
    ListProps &
    LinkProps &
    LabelProps &
    ImageProps &
    SvgProps & {
      alignItems: UIProp<string>;
      borderRadius: UIProp<string | number>;
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
      flexWrap: UIProp<string>;
      cursor: UIProp<string>;
      animation: UIProp<FlattenSimpleInterpolation>;
      onClick: (event: MouseEvent<HTMLElement>) => void;
      onInput: (event: ChangeEvent<HTMLInputElement>) => void;
      onSubmit: (event: FormEvent<HTMLFormElement>) => void;
      onMouseOver: (event: MouseEvent<HTMLFormElement>) => void;
    }
>;

const remInPixels = 15;

const wrapStatementWithBreakpoint = (
  breakpoint: string,
  statementToWrap: string | (() => FlattenInterpolation<{ theme: Theme }>),
) => () => css`
  @media (max-width: ${breakpoint}px) {
    ${statementToWrap}
  }
`;

const createCSSStatement = (
  key: string,
  value: UIPropValue<ValidUIPropTypes>,
  parser?: Parser,
) => () => {
  return css`
    ${kebabCase(key)}: ${parser ? parser(value) : value};
  `;
};

const isString = (value: unknown): value is string => {
  if (typeof value === 'string' || value instanceof String) return true;
  return false;
};

const isNumber = (value: unknown): value is number => {
  if (isString(value)) return false;
  return !Number.isNaN(value);
};

const isUIProp = (value: unknown): value is UIProp<ValidUIPropTypes> => {
  return [isString, isNumber, isUIPropObject].some((validator) =>
    validator(value),
  );
};

const isUIPropObject = (
  value: unknown,
): value is UIPropObject<ValidUIPropTypes> => {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return true;
  }
  return false;
};

const createUIPropObject = (
  value: UIPropValue<ValidUIPropTypes>,
): UIPropObject<ValidUIPropTypes> => {
  return {
    default: value,
  };
};

const isDefined = <T,>(value: T | undefined | null): value is T => {
  return value !== undefined && value !== null;
};

const parseProperty = (key: string, parser?: Parser, customValue?: unknown) => (
  props: UnknownProps,
) => {
  const value = customValue ?? props[key];

  if (!isUIProp(value)) return css``;

  const parsedValue = isUIPropObject(value) ? value : createUIPropObject(value);

  const { default: defaultValue, hover, ...rest } = parsedValue;

  const style = css`
    ${isDefined<UIPropValue<ValidUIPropTypes>>(defaultValue) &&
    createCSSStatement(key, defaultValue, parser)}
    ${isDefined<UIPropValue<ValidUIPropTypes>>(hover) &&
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

const parseSpacing = (value: UIPropValue<number>) => (
  props?: ThemeProps<Theme>,
) => {
  const parsedValue = typeof value === 'function' ? value(props) : value;

  if (value === 0) return '0rem';

  return `
  ${(1 / remInPixels) * 2 ** parsedValue}rem
`;
};

const parseDimension = (value: UIPropValue<string | number>) => (
  props: ThemeProps<Theme>,
) => {
  const parsedValue = typeof value === 'function' ? value(props) : value;

  if (!isString(parsedValue)) {
    return `${Number(parsedValue)}px`;
  }
  return parsedValue;
};

const parseShorthandProperty = (
  shorthand: string,
  propsToChange: string[],
  parser: Parser,
) => (props: UnknownProps) =>
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
  ${parseProperty('borderRadius')};
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
  ${parseProperty('flexWrap')};
  ${parseProperty('cursor')};

  ${parseProperty('animation')}
`;

const StyledBox = styled.div`
  ${boxProps}
`;

const boxPropTypes = [
  'alignItems',
  'animation',
  'as',
  'backgroundColor',
  'backgroundPosition',
  'backgroundRepeat',
  'borderRadius',
  'bottom',
  'color',
  'cursor',
  'display',
  'flex',
  'flexWrap',
  'fontSize',
  'fontWeight',
  'height',
  'justifyContent',
  'left',
  'lineHeight',
  'margin',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginX',
  'marginY',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'objectFit',
  'onClick',
  'opacity',
  'padding',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingX',
  'paddingY',
  'position',
  'right',
  'stroke',
  'textAlign',
  'top',
  'width',
  'zIndex',
] as const;

const getBoxProps = (props: UnknownProps) => pick(props, boxPropTypes);

const Box = forwardRef<HTMLElement, BoxProps>(({ children, ...props }, ref) => (
  <StyledBox ref={ref} {...props}>
    {children}
  </StyledBox>
));

Box.displayName = 'Box';

Box.defaultProps = {
  as: 'div',
};

export {
  Box,
  boxProps,
  boxPropTypes,
  getBoxProps,
  parseDimension,
  parseProperty,
  parseSpacing,
};

export type { BoxProps, UIProp, UnknownProps };
