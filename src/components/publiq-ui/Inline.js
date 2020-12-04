import styled, { css } from 'styled-components';
import { Box, boxPropTypes, boxProps, parseProperty } from './Box';
import PropTypes from 'prop-types';
import { Children, cloneElement, forwardRef } from 'react';
import { pick } from 'lodash';
import { useMediaQuery } from '@material-ui/core';
import { Breakpoints } from '../publiq-ui/theme';

const parseStackOnProperty = () => ({ stackOn }) => {
  if (typeof stackOn !== 'boolean') {
    return css`
      @media (max-width: ${stackOn}px) {
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
    console.log({ stackOn });
    const isMediaQuery =
      typeof stackOn !== 'boolean'
        ? useMediaQuery(`(max-width:${stackOn}px)`)
        : true;

    const margin = !(stackOn && isMediaQuery)
      ? { marginRight: spacing }
      : { marginBottom: spacing };

    const clonedChildren = Children.map(children, (child, i) => {
      const isLastItem = i === children.length - 1;

      if (!child) return;

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
