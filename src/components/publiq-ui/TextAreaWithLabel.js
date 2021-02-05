import PropTypes from 'prop-types';
import { Label, LabelVariants } from './Label';
import { getStackProps, Stack, stackPropTypes } from './Stack';
import { TextArea } from './TextArea';

const TextAreaWithLabel = ({ id, label, children, className, ...props }) => {
  return (
    <Stack as="div" spacing={3} className={className} {...getStackProps(props)}>
      <Label htmlFor={id} variant={LabelVariants.BOLD}>
        {label}
      </Label>
      <TextArea id={id}>{children}</TextArea>
    </Stack>
  );
};

TextAreaWithLabel.propTypes = {
  ...stackPropTypes,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export { TextAreaWithLabel };
