import PropTypes from 'prop-types';
import { Spinner as BootstrapSpinner } from 'react-bootstrap';
import { Box, boxPropTypes, getBoxProps } from './Box';
import { getValueFromTheme } from './theme';

const SpinnerVariants = {
  PRIMARY: 'primary',
  LIGHT: 'light',
};

const SpinnerSizes = {
  SMALL: 'sm',
};

const getValue = getValueFromTheme('spinner');

const Spinner = ({ variant, size, className, ...props }) => {
  return (
    <Box
      className={className}
      width="100%"
      alignItems="center"
      textAlign="center"
      css={`
        .text-primary {
          color: ${getValue('primary.color')} !important;
        }
        .text-light {
          color: ${getValue('light.color')} !important;
        }
      `}
      {...getBoxProps(props)}
    >
      <BootstrapSpinner
        as={Box}
        animation="border"
        variant={variant}
        size={size}
      />
    </Box>
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
