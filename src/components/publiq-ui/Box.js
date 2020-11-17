import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { kebabCase, pick } from 'lodash';
import { forwardRef } from 'react';

const remInPixels = 15;

const parseProperty = (key) => (props) => {
  const value = props[key];
  if (key === undefined || key === null) return;

  const cssProperty = kebabCase(key);

  return css`
    ${cssProperty}: ${value};
  `;
};

const parseSpacing = (value) => () => (1 / remInPixels) * 2 ** value;

const parseSpacingProperty = (key, prop) => (props) => {
  const value = props[prop || key];
  if (value === '' || value === undefined || value === null) return;

  const cssProperty = kebabCase(key);

  if (Number(value) === 0) {
    return css`
      ${cssProperty}: 0;
    `;
  }

  return css`
    ${cssProperty}: ${parseSpacing(value)}rem;
  `;
};

const createShorthandSpacingProperty = (shorthand, propsToChange = []) => (
  props,
) => {
  if (props[shorthand] === undefined) return;

  return propsToChange.reduce((acc, val) => {
    return css`
      ${parseSpacingProperty(val, shorthand)};
      ${acc};
    `;
  }, css``);
};

const boxProps = css`
  ${createShorthandSpacingProperty('margin', [
    'marginTop',
    'marginBottom',
    'marginLeft',
    'marginRight',
  ])};

  ${createShorthandSpacingProperty('marginY', ['marginTop', 'marginBottom'])};
  ${createShorthandSpacingProperty('marginX', ['marginLeft', 'marginRight'])};

  ${parseSpacingProperty('marginTop')};
  ${parseSpacingProperty('marginBottom')};
  ${parseSpacingProperty('marginLeft')};
  ${parseSpacingProperty('marginRight')};

  ${createShorthandSpacingProperty('padding', [
    'paddingTop',
    'paddingBottom',
    'paddingLeft',
    'paddingRight',
  ])};

  ${createShorthandSpacingProperty('paddingY', [
    'paddingTop',
    'paddingBottom',
  ])};
  ${createShorthandSpacingProperty('paddingX', [
    'paddingLeft',
    'paddingRight',
  ])};

  ${parseSpacingProperty('paddingTop')};
  ${parseSpacingProperty('paddingBottom')};
  ${parseSpacingProperty('paddingLeft')};
  ${parseSpacingProperty('paddingRight')};
`;

const StyledBox = styled.div`
  ${boxProps}
`;

const boxPropTypes = {
  margin: PropTypes.number,
  marginTop: PropTypes.number,
  marginBottom: PropTypes.number,
  marginRight: PropTypes.number,
  marginLeft: PropTypes.number,
  marginX: PropTypes.number,
  marginY: PropTypes.number,
  padding: PropTypes.number,
  paddingTop: PropTypes.number,
  paddingBottom: PropTypes.number,
  paddingRight: PropTypes.number,
  paddingLeft: PropTypes.number,
  paddingX: PropTypes.number,
  paddingY: PropTypes.number,
};

const getBoxProps = (props) => pick(props, Object.keys(boxPropTypes));

const Box = forwardRef(
  (
    {
      children,
      className,
      margin,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      marginX,
      marginY,
      padding,
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingX,
      paddingY,
      ...props
    },
    ref,
  ) => {
    return (
      <StyledBox
        margin={margin}
        marginTop={marginTop}
        marginBottom={marginBottom}
        marginLeft={marginLeft}
        marginRight={marginRight}
        marginX={marginX}
        marginY={marginY}
        padding={padding}
        paddingTop={paddingTop}
        paddingBottom={paddingBottom}
        paddingLeft={paddingLeft}
        paddingRight={paddingRight}
        paddingX={paddingX}
        paddingY={paddingY}
        className={className}
        ref={ref}
        {...props}
      >
        {children}
      </StyledBox>
    );
  },
);

Box.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  ...boxPropTypes,
};

Box.defaultProps = {
  as: 'div',
};

export { Box, boxProps, boxPropTypes, getBoxProps, parseProperty };
