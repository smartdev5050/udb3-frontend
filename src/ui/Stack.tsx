import pick from 'lodash/pick';
import type { ReactNode } from 'react';
import { Children, cloneElement, forwardRef } from 'react';
import styled, { css } from 'styled-components';

import type { BoxProps, UIProp, UnknownProps } from './Box';
import {
  Box,
  boxProps,
  boxPropTypes,
  FALSY_VALUES,
  parseProperty,
} from './Box';
import type { BreakpointValues } from './theme';

type StackProps = {
  spacing?: UIProp<number>;
  stackOn?: BreakpointValues;
};

type Props = BoxProps & StackProps;

const stackProps = css`
  display: flex;
  flex-direction: column;

  ${parseProperty('alignItems')};
  ${parseProperty('justifyContent')};
`;

const StyledBox = styled(Box)`
  ${stackProps};
  ${boxProps};
`;

const Stack = forwardRef<HTMLElement, Props>(
  ({ spacing, className, children, as, ...props }, ref) => {
    const validChildren = Children.toArray(children).filter(
      (child) => !FALSY_VALUES.includes(child),
    );

    const clonedChildren = Children.map(validChildren, (child, i) => {
      const isLastItem = i === validChildren.length - 1;

      // @ts-expect-error
      return cloneElement(child, {
        // @ts-expect-error
        ...child.props,
        ...(!isLastItem ? { marginBottom: spacing } : {}),
      });
    });

    return (
      <StyledBox className={className} as={as} ref={ref} {...props}>
        {clonedChildren}
      </StyledBox>
    );
  },
);

Stack.displayName = 'Stack';

const stackPropTypes = ['spacing', 'alignItems', 'justifyContent'];

const getStackProps = (props: UnknownProps) =>
  pick(props, [...boxPropTypes, ...stackPropTypes]);

Stack.defaultProps = {
  as: 'section',
};

export { getStackProps, Stack, stackProps, stackPropTypes };
export type { Props as StackProps };
