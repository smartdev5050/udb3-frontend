import { Label, LabelVariants } from './Label';
import { RadioButtonWithLabel } from './RadioButtonWithLabel';
import { getStackProps, Stack } from './Stack';

type Item = {
  value: string;
  label?: string;
  info?: string;
};

type Props = {
  name: string;
  groupLabel?: string;
  items?: Array<Item>;
  selected: string;
  className: string;
  onChange: () => void;
};

const RadioButtonGroup = ({
  name,
  groupLabel,
  items,
  selected,
  className,
  onChange,
  ...props
}: Props) => {
  return (
    <Stack className={className} as="div" spacing={3} {...getStackProps(props)}>
      <Stack as="ul" spacing={2}>
        {items.map((item: Item) => (
          <RadioButtonWithLabel
            key={item.value}
            value={item.value}
            id={`${name}-radio-${item.value}`}
            name={name}
            onChange={onChange}
            label={item.label}
            info={item.info}
          />
        ))}
      </Stack>
    </Stack>
  );
};

RadioButtonGroup.defaultProps = {
  name: '',
  groupLabel: '',
  items: [],
};

export { RadioButtonGroup };
