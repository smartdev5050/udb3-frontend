import styled from 'styled-components';
import { Box, spacingPropTypes } from './Box';
import PropTypes from 'prop-types';
import { pick } from 'lodash';
import { Children, cloneElement } from 'react';

const StyledInline = styled(Box)`
  display: flex;
  flex-direction: row;
`;

const Inline = ({ spacing, className, children, as, ...props }) => {
  const layoutProps = pick(props, Object.keys(spacingPropTypes));

  const clonedChildren = Children.map(children, (child, i) =>
    cloneElement(child, {
      ...child.props,
      marginRight: i < children.length - 1 ? spacing : 0,
    }),
  );

  return (
    <StyledInline className={className} {...layoutProps} as={as}>
      {clonedChildren}
    </StyledInline>
  );
};

Inline.propTypes = {
  ...spacingPropTypes,
  as: PropTypes.string,
  spacing: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.node,
};

Inline.defaultProps = {
  as: 'section',
};

export { Inline };
