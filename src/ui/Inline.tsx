import pick from 'lodash/pick';
import { Children, cloneElement, forwardRef } from 'react';
import styled, { css } from 'styled-components';

import { useMatchBreakpoint } from '@/hooks/useMatchBreakpoint';

import type { BoxProps, UIProp, UnknownProps } from './Box';
import { Box, boxProps, boxPropTypes, parseProperty } from './Box';
import type { BreakpointValues } from './theme';

type InlineProps = {
  spacing?: UIProp<number>;
  stackOn?: BreakpointValues;
};

type Props = BoxProps & InlineProps;

const parseStackOnProperty = () => ({ stackOn }: Props) => {
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

const Inline = forwardRef<HTMLElement, Props>(
  ({ spacing, className, children, as, stackOn, ...props }, ref) => {
    const shouldCollapse = useMatchBreakpoint(stackOn);

    const marginProp =
      shouldCollapse && stackOn ? 'marginBottom' : 'marginRight';

    const notNullChildren = Children.toArray(children).filter(
      (child) => child !== null,
    );

    const clonedChildren = Children.map(notNullChildren, (child, i) => {
      const isLastItem = i === notNullChildren.length - 1;

      // @ts-expect-error
      return cloneElement(child, {
        // @ts-expect-error
        ...child.props,
        ...(!isLastItem ? { [marginProp]: spacing } : {}),
      });
    });

    return (
      <StyledBox
        as={as}
        className={className}
        stackOn={stackOn}
        {...props}
        ref={ref}
      >
        {clonedChildren}
      </StyledBox>
    );
  },
);

Inline.displayName = 'Inline';

const inlinePropTypes = ['spacing', 'alignItems', 'justifyContent', 'stackOn'];

const getInlineProps = (props: UnknownProps) =>
  pick(props, [...boxPropTypes, ...inlinePropTypes]);

Inline.defaultProps = {
  as: 'section',
};

export { getInlineProps, Inline, inlineProps, inlinePropTypes };
export type { Props as InlineProps };
