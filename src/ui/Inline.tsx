import { pickBy } from 'lodash';
import { Children, cloneElement, forwardRef } from 'react';
import styled, { css } from 'styled-components';

import { useMatchBreakpoint } from '@/hooks/useMatchBreakpoint';

import type { BoxProps, UIProp, UnknownProps } from './Box';
import {
  Box,
  boxProps,
  boxPropTypes,
  FALSY_VALUES,
  parseProperty,
} from './Box';
import type { BreakpointValues } from './theme';

type InlineProps = {
  spacing?: UIProp<number>;
  stackOn?: BreakpointValues;
};

type Props = BoxProps & InlineProps;

const parseStackOnProperty =
  () =>
  ({ stackOn }: Props) => {
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
  ${parseProperty('alignSelf')};
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

    const validChildren = Children.toArray(children).filter(
      (child) => !FALSY_VALUES.includes(child),
    );

    const clonedChildren = Children.map(validChildren, (child, i) => {
      const isLastItem = i === validChildren.length - 1;

      // @ts-expect-error
      return cloneElement(child, {
        // @ts-expect-error
        ...child.props,
        ...(!isLastItem && spacing ? { [marginProp]: spacing } : {}),
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

const inlinePropTypes = [
  'spacing',
  'alignItems',
  'alignSelf',
  'justifyContent',
  'stackOn',
];

const getInlineProps = (props: UnknownProps) =>
  pickBy(props, (_value, key) => {
    // pass aria attributes to the DOM element
    if (key.startsWith('aria-')) {
      return true;
    }

    const propTypes: string[] = [...boxPropTypes, ...inlinePropTypes];

    return propTypes.includes(key);
  });

Inline.defaultProps = {
  as: 'section',
};

export { getInlineProps, Inline };
export type { Props as InlineProps };
