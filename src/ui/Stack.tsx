import styled, { css } from 'styled-components';
import {
  Box,
  boxPropTypes,
  boxProps,
  parseProperty,
  UnknownProps,
} from './Box';
import type { UIProp, BoxProps } from './Box';
import { Children, cloneElement, forwardRef } from 'react';
import pick from 'lodash/pick';
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

const Stack = forwardRef<HTMLDivElement, Props>(
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

export { Stack, getStackProps, stackPropTypes, stackProps };
export type { StackProps };
