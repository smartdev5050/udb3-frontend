import type { InlineProps } from './Inline';
import { getInlineProps, Inline } from './Inline';
import type { InputProps } from './Input';
import { Input } from './Input';
import { Label, LabelVariants } from './Label';

type Props = InlineProps &
  InputProps & {
    label: string;
  };

const InputWithLabel = ({
  type,
  id,
  label,
  placeholder,
  className,
  onChange,
  ...props
}: Props) => (
  <Inline
    className={className}
    as="div"
    spacing={3}
    alignItems="center"
    {...getInlineProps(props)}
  >
    <Label htmlFor={id} variant={LabelVariants.BOLD}>
      {label}
    </Label>
    <Input type={type} id={id} placeholder={placeholder} onChange={onChange} />
  </Inline>
);

InputWithLabel.defaultProps = {
  type: 'text',
};

export { InputWithLabel };
