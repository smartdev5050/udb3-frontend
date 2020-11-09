import PropTypes from 'prop-types';
import { Label, LabelVariants } from './Label';
import { Inline } from './Inline';
import { Input } from './Input';
import { spacingPropTypes, getLayoutProps } from './Box';

const InputWithLabel = ({
  type,
  id,
  children,
  placeholder,
  className,
  ...props
}) => {
  const layoutProps = getLayoutProps(props);
  return (
    <Inline
      className={className}
      as="div"
      spacing={3}
      alignItems="center"
      {...layoutProps}
    >
      <Label htmlFor={id} variant={LabelVariants.BOLD}>
        {children}
      </Label>
      <Input type={type} id={id} placeholder={placeholder} />
    </Inline>
  );
};

InputWithLabel.propTypes = {
  ...spacingPropTypes,
  className: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string.isRequired,
  children: PropTypes.string,
  placeholder: PropTypes.string,
};

InputWithLabel.defaultProps = {
  type: 'text',
};

export { InputWithLabel };
