import styled from 'styled-components';
import { Box, spacingPropTypes } from './Box';
import PropTypes from 'prop-types';
import { pick } from 'lodash';
import { Children, cloneElement } from 'react';

const StyledStack = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const Stack = ({ spacing, className, children, as, ...props }) => {
  const layoutProps = pick(props, Object.keys(spacingPropTypes));

  const clonedChildren = Children.map(children, (child, i) =>
    cloneElement(child, {
      ...child.props,
      marginBottom: i < children.length - 1 ? spacing : 0,
    }),
  );

  return (
    <StyledStack className={className} {...layoutProps} as={as}>
      {clonedChildren}
    </StyledStack>
  );
};

export const stackProps = {
  ...spacingPropTypes,
  spacing: PropTypes.number,
};

Stack.propTypes = {
  ...stackProps,
  as: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

Stack.defaultProps = {
  as: 'section',
};

export { Stack };
