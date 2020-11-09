import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { kebabCase } from 'lodash';

const remInPixels = 15;

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

export const spacingProps = css`
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
  ${spacingProps}
`;

export const spacingPropTypes = {
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

const Box = ({
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
}) => (
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
  >
    {children}
  </StyledBox>
);

Box.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  ...spacingPropTypes,
};

export { Box };
