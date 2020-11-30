import styled, { css } from 'styled-components';
import { Box, boxPropTypes, parseProperty } from './Box';
import PropTypes from 'prop-types';
import { Children, cloneElement, forwardRef } from 'react';
import { pick } from 'lodash';

const stackProps = css`
  display: flex;
  flex-direction: column;

  ${parseProperty('alignItems')};
  ${parseProperty('justifyContent')};
`;

const StyledBox = styled(Box)`
  ${stackProps}
`;

const Stack = forwardRef(
  ({ spacing, className, children, as, ...props }, ref) => {
    const clonedChildren = Children.map(children, (child, i) => {
      const isLastItem = i === children.length - 1;

      if (!child) return;

      return cloneElement(child, {
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

const stackPropTypes = {
  ...boxPropTypes,
  spacing: PropTypes.number,
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
};

export { Stack, getStackProps, stackPropTypes, stackProps };
