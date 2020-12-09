import styled, { css } from 'styled-components';
import { Box, boxPropTypes, boxProps, parseProperty } from './Box';
import PropTypes from 'prop-types';
import { Children, cloneElement, forwardRef } from 'react';
import { pick } from 'lodash';
import { Breakpoints } from '../publiq-ui/theme';
import { useMatchBreakpoint } from '../../hooks/useMatchBreakpoint';

const parseStackOnProperty = () => ({ stackOn }) => {
  if (!stackOn) {
    return;
  }
  return css`
    @media (max-width: ${(props) => props.theme.breakpoints[stackOn]}px) {
      flex-direction: column;
    }
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
    const marginProp = useMatchBreakpoint(stackOn)
      ? 'marginBottom'
      : 'marginRight';

    console.log(marginProp);

    const clonedChildren = Children.map(children, (child, i) => {
      const isLastItem = i === children.length - 1;

      if (!child) return;

      return cloneElement(child, {
        ...child.props,
        ...(!isLastItem ? { [marginProp]: spacing } : {}),
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
  stackOn: PropTypes.oneOf(...Object.values(Breakpoints)),
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
};

export { Inline, getInlineProps, inlinePropTypes, inlineProps };
