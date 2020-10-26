import PropTypes from 'prop-types';
import { Button as BootstrapButton } from 'react-bootstrap';

const ButtonVariants = {
  PRIMARY: 'primary',
  SECONDARY: 'outline-secondary',
  SUCCESS: 'success',
  DANGER: 'danger',
};

const Button = ({ variant, disabled, loading, children }) => {
  console.log(loading);
  return (
    <BootstrapButton variant={variant} disabled={disabled}>
      {children}
    </BootstrapButton>
  );
};

Button.propTypes = {
  variant: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  children: PropTypes.node,
};

Button.defaultProps = {
  variant: ButtonVariants.PRIMARY,
  disabled: false,
  loading: false,
};

export { ButtonVariants, Button };
