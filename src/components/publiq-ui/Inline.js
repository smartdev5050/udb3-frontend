import styled, { css } from 'styled-components';
import { Box, boxPropTypes, parseProperty } from './Box';
import PropTypes from 'prop-types';
import { Children, cloneElement, forwardRef } from 'react';
import { pick } from 'lodash';

const inlineProps = css`
  display: flex;
  flex-direction: row;

  ${parseProperty('alignItems')};
  ${parseProperty('justifyContent')};
`;

const StyledBox = styled(Box)`
  ${inlineProps};
`;

const Inline = forwardRef(
  ({ spacing, className, children, as, ...props }, ref) => {
    const clonedChildren = Children.map(children, (child, i) => {
      const isLastItem = i === children.length - 1;

      if (!child) return;

      // if child is functional component
      return cloneElement(child, {
        ...child.props,
        ...(!isLastItem ? { marginRight: spacing } : {}),
      });
    });

    return (
      <StyledBox className={className} forwardedAs={as} {...props} ref={ref}>
        {clonedChildren}
      </StyledBox>
    );
  },
);

const inlinePropTypes = {
  ...boxPropTypes,
  spacing: PropTypes.number,
};

const getInlineProps = (props) => pick(props, Object.keys(inlinePropTypes));

Inline.propTypes = {
  ...inlinePropTypes,
  as: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  alignItems: PropTypes.string,
  justifyContent: PropTypes.string,
};

Inline.defaultProps = {
  as: 'section',
};

export { Inline, getInlineProps, inlinePropTypes, inlineProps };
