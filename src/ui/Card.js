import PropTypes from 'prop-types';
import { Card as BootstrapCard } from 'react-bootstrap';

import { getStackProps, Stack } from './Stack';

const Card = ({ children, className, ...props }) => {
  return (
    <BootstrapCard
      forwardedAs={Stack}
      className={className}
      {...getStackProps(props)}
      css={`
        &.card {
          border: none;
        }
      `}
    >
      {children}
    </BootstrapCard>
  );
};

Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Card };
