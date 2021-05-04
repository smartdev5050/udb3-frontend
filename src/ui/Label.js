import PropTypes from 'prop-types';

import { Box,boxPropTypes, getBoxProps } from './Box';

export const LabelVariants = {
  BOLD: 'bold',
  NORMAL: 'normal',
};

const getFontWeight = (props) => {
  if (props.variant === LabelVariants.BOLD) return 700;
  return 'normal';
};

const Label = ({ htmlFor, children, className, variant, ...props }) => (
  <Box
    forwardedAs="label"
    htmlFor={htmlFor}
    className={className}
    variant={variant}
    css={`
      font-weight: ${getFontWeight};
    `}
    {...getBoxProps(props)}
  >
    {children}
  </Box>
);

Label.propTypes = {
  ...boxPropTypes,
  variant: PropTypes.string,
  htmlFor: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

Label.defaultProps = {
  variant: LabelVariants.NORMAL,
};

export { Label };
