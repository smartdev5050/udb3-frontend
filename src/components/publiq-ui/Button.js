import PropTypes from 'prop-types';
import { Button as BootstrapButton } from 'react-bootstrap';
import styled from 'styled-components';
import { get } from 'lodash';

const ButtonVariants = {
  PRIMARY: 'primary',
  SECONDARY: 'outline-secondary',
  SUCCESS: 'success',
  DANGER: 'danger',
};

const getValue = (path) => (props) => {
  return get(props.theme.components.button, path);
};

const StyledBootstrapButton = styled(BootstrapButton)`
  &.btn {
    border-radius: ${getValue('borderRadius')};
    padding: ${getValue('paddingY')} ${getValue('paddingX')};
  }

  &.btn-outline-secondary {
    color: ${getValue('secondary.color')};
    background-color: ${getValue('secondary.backgroundColor')};

    &:hover {
      background-color: #e6e6e6;
      border-color: #adadad;
    }
  }
`;

const Button = ({ variant, disabled, loading, children }) => {
  // TODO: Add loading spinner when loading is true
  return (
    <StyledBootstrapButton variant={variant} disabled={disabled}>
      {children}
    </StyledBootstrapButton>
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
