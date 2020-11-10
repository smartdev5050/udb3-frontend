import PropTypes from 'prop-types';
import { Spinner as BootstrapSpinner } from 'react-bootstrap';
import styled from 'styled-components';
import { boxProps, boxPropTypes, getBoxProps } from './Box';

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

  ${boxProps};
`;

const Spinner = ({ variant, size, className, ...props }) => {
  return (
    <StyledDiv className={className} {...getBoxProps(props)}>
      <BootstrapSpinner animation="border" variant={variant} size={size} />
    </StyledDiv>
  );
};

Spinner.propTypes = {
  ...boxPropTypes,
  variant: PropTypes.oneOf(Object.values(SpinnerVariants)),
  size: PropTypes.oneOf(Object.values(SpinnerSizes)),
  className: PropTypes.string,
};

Spinner.defaultProps = {
  variant: SpinnerVariants.PRIMARY,
};

export { Spinner, SpinnerVariants, SpinnerSizes };
