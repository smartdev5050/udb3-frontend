import styled, { css } from 'styled-components';
import { Box, boxPropTypes, boxProps, parseProperty } from './Box';
import PropTypes from 'prop-types';
import { Children, cloneElement, forwardRef } from 'react';
import { pick } from 'lodash';
import { Breakpoints } from './theme';
import { useMediaQuery } from '@material-ui/core';

const parseInlineOnProperty = () => ({ inlineOn }) => {
  if (typeof inlineOn === 'string') {
    const breakpoint = Breakpoints[inlineOn];
    return css`
      @media (min-width: ${breakpoint}px) {
        flex-direction: row;
      }
    `;
  }
  return css`
    ${inlineOn && 'flex-direction: row;'}
  `;
};

const stackProps = css`
  display: flex;
  flex-direction: column;

  ${parseProperty('alignItems')};
  ${parseProperty('justifyContent')};
  ${parseInlineOnProperty()};
`;

const StyledBox = styled(Box)`
  ${stackProps};
  ${boxProps};
`;

const Stack = forwardRef(
  ({ spacing, className, children, as, inlineOn, ...props }, ref) => {
    const isMediaQuery =
      typeof inlineOn === 'string'
        ? useMediaQuery(`(min-width:${Breakpoints[inlineOn]}px)`)
        : true;

    const margin = !(inlineOn && isMediaQuery)
      ? { marginBottom: spacing }
      : { marginRight: spacing };

    const clonedChildren = Children.map(children, (child, i) => {
      const isLastItem = i === children.length - 1;

      if (!child) return;

      return cloneElement(child, {
        ...child.props,
        ...(!isLastItem ? margin : {}),
      });
    });

    return (
      <StyledBox
        className={className}
        forwardedAs={as}
        ref={ref}
        inlineOn={inlineOn}
        {...props}
      >
        {clonedChildren}
      </StyledBox>
    );
  },
);

const stackPropTypes = {
  ...boxPropTypes,
  spacing: PropTypes.number,
  inlineOn: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(Object.values(Breakpoints)),
  ]),
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
  inlineOn: false,
};

export { Stack, getStackProps, stackPropTypes, stackProps };
