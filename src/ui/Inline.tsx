import styled, { css } from 'styled-components';
import { Box, boxPropTypes, boxProps, parseProperty } from './Box';
import type { BoxProps, UIProp } from './Box';
import { Children, cloneElement, forwardRef } from 'react';
import pick from 'lodash/pick';
// import { Breakpoints } from './theme';
import { useMatchBreakpoint } from '@/hooks/useMatchBreakpoint';

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

type InlineProps = {
  spacing: UIProp<number>;
  alignItems: UIProp<string>;
  justifyContent: UIProp<string>;
  stackOn: string;
};

type Props = InlineProps & BoxProps;

const Inline = forwardRef<HTMLDivElement, Props>(
  ({ spacing, className, children, as, stackOn, ...props }, ref) => {
    const shouldCollapse = useMatchBreakpoint(stackOn);

    const marginProp =
      shouldCollapse && stackOn ? 'marginBottom' : 'marginRight';

    const notNullChildren = Children.toArray(children).filter(
      (child) => child !== null,
    );

    const clonedChildren = Children.map(notNullChildren, (child, i) => {
      const isLastItem = i === notNullChildren.length - 1;

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

const inlinePropTypes = ['spacing', 'alignItems', 'justifyContent', 'stackOn'];

const getInlineProps = (props) =>
  pick(props, [...boxPropTypes, ...inlinePropTypes]);

Inline.defaultProps = {
  as: 'section',
};

export { Inline, getInlineProps, inlineProps, inlinePropTypes };
export type { InlineProps };
