import PropTypes from 'prop-types';
import { Spinner as BootstrapSpinner } from 'react-bootstrap';
import styled from 'styled-components';

const SpinnerVariants = {
  PRIMARY: 'primary',
  LIGHT: 'light',
};

const SpinnerSizes = {
  SMALL: 'sm',
};

const StyledDiv = styled.div`
  width: 100%;
  align-items: center;
`;

const Spinner = ({ variant, size, className }) => {
  return (
    <StyledDiv className={className}>
      <BootstrapSpinner animation="border" variant={variant} size={size} />
    </StyledDiv>
  );
};

Spinner.propTypes = {
  variant: PropTypes.oneOf(Object.values(SpinnerVariants)),
  size: PropTypes.oneOf(Object.values(SpinnerSizes)),
  className: PropTypes.string,
};

Spinner.defaultProps = {
  variant: SpinnerVariants.PRIMARY,
};

export { Spinner, SpinnerVariants, SpinnerSizes };
