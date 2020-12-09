import styled, { css } from 'styled-components';
import { Box, boxPropTypes, boxProps, parseProperty } from './Box';
import PropTypes from 'prop-types';
import { Children, cloneElement, forwardRef } from 'react';
import { pick } from 'lodash';
import { Breakpoints } from '../publiq-ui/theme';
import { useMatchBreakpoint } from '../../hooks/useMatchBreakpoint';

const parseStackOnProperty = () => ({ stackOn }) => {
  if (typeof stackOn !== 'boolean') {
    return css`
      @media (max-width: ${(props) => props.theme.breakpoints[stackOn]}px) {
        flex-direction: column;
      }
    `;
  }
  return css`
    ${stackOn && 'flex-direction: column;'}
  `;
};

const inlineProps = css`
  display: flex;
  flex-direction: row;

  ${parseProperty('alignItems')};
  ${parseProperty('justifyContent')};
  ${parseStackOnProperty()};
`;

const StyledBox = styled(Box)`
  ${inlineProps};
  ${boxProps};
`;

const Inline = forwardRef(
  ({ spacing, className, children, as, stackOn, ...props }, ref) => {
    const isMediaQuery =
      typeof stackOn !== 'boolean' ? useMatchBreakpoint(stackOn) : true;

    const margin = !(stackOn && isMediaQuery)
      ? { marginRight: spacing }
      : { marginBottom: spacing };

    const notNullChildren = Children.toArray(children).filter(
      (child) => child !== null,
    );

    const clonedChildren = Children.map(notNullChildren, (child, i) => {
      const isLastItem = i === notNullChildren.length - 1;

      return cloneElement(child, {
        ...child.props,
        ...(!isLastItem ? margin : {}),
      });
    });

    return (
      <StyledBox
        className={className}
        forwardedAs={as}
        stackOn={stackOn}
        {...props}
        ref={ref}
      >
        {clonedChildren}
      </StyledBox>
    );
  },
);

const inlinePropTypes = {
  ...boxPropTypes,
  spacing: PropTypes.number,
  alignItems: PropTypes.string,
  justifyContent: PropTypes.string,
  stackOn: PropTypes.oneOf([true, false, ...Object.values(Breakpoints)]),
};

const getInlineProps = (props) => pick(props, Object.keys(inlinePropTypes));

Inline.propTypes = {
  ...inlinePropTypes,
  as: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

Inline.defaultProps = {
  as: 'section',
  stackOn: false,
};

export { Inline, getInlineProps, inlinePropTypes, inlineProps };
