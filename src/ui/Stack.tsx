import pick from 'lodash/pick';
import { Children, cloneElement, forwardRef } from 'react';
import styled, { css } from 'styled-components';

import type { BoxProps, UIProp, UnknownProps } from './Box';
import { Box, boxProps, boxPropTypes, parseProperty } from './Box';
import type { BreakpointValues } from './theme';

type StackProps = {
  spacing?: UIProp<number>;
  alignItems?: UIProp<string>;
  justifyContent?: UIProp<string>;
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
    const notNullChildren = Children.toArray(children).filter(
      (child) => child !== null,
    );

    const clonedChildren = Children.map(notNullChildren, (child, i) => {
      const isLastItem = i === notNullChildren.length - 1;

      // @ts-expect-error
      return cloneElement(child, {
        // @ts-expect-error
        ...child.props,
        ...(!isLastItem ? { marginBottom: spacing } : {}),
      });
    });

    return (
      <StyledBox className={className} forwardedAs={as} ref={ref} {...props}>
        {clonedChildren}
      </StyledBox>
    );
  },
);

const stackPropTypes = ['spacing', 'alignItems', 'justifyContent'];

const getStackProps = (props: UnknownProps) =>
  pick(props, [...boxPropTypes, ...stackPropTypes]);

Stack.defaultProps = {
  as: 'section',
};

export { getStackProps, Stack, stackProps, stackPropTypes };
export type { Props as StackProps };
