import PropTypes from 'prop-types';
import { Spinner as BootstrapSpinner } from 'react-bootstrap';

const SpinnerVariants = {
  PRIMARY: 'primary',
  LIGHT: 'light',
};

const SpinnerSizes = {
  NORMAL: undefined,
  SMALL: 'sm',
};

const Spinner = ({ variant, size, className }) => {
  return (
    <BootstrapSpinner
      animation="border"
      variant={variant}
      size={size}
      className={className}
    />
  );
};

Spinner.propTypes = {
  variant: PropTypes.oneOf(Object.values(SpinnerVariants)),
  size: PropTypes.oneOf(Object.values(SpinnerSizes)),
  className: PropTypes.string,
};

Spinner.defaultProps = {
  variant: SpinnerVariants.PRIMARY,
  size: SpinnerSizes.NORMAL,
};

export { Spinner, SpinnerVariants, SpinnerSizes };
