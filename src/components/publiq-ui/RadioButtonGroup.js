import PropTypes from 'prop-types';
import { Label, LabelVariants } from './Label';
import { Stack } from './Stack';
import { RadioButtonWithLabel } from './RadioButtonWithLabel';

const RadioButtonGroup = ({
  name,
  groupLabel,
  items,
  selected,
  className,
  onChange,
}) => {
  return (
    <Stack className={className} as="div" spacing={3}>
      {groupLabel && <Label variant={LabelVariants.BOLD}>{groupLabel}</Label>}
      <Stack role="radiogroup" as="div" spacing={2}>
        {items.map((item) => (
          <RadioButtonWithLabel
            key={item.value}
            value={item.value}
            checked={selected === item.value}
            id={`radio-${item.value}`}
            name={name}
            onChange={onChange}
            label={item.label}
          />
        ))}
      </Stack>
    </Stack>
  );
};

RadioButtonGroup.propTypes = {
  name: PropTypes.string.isRequired,
  groupLabel: PropTypes.string,
  items: PropTypes.array,
  selected: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
};

RadioButtonGroup.defaultProps = {
  name: '',
  groupLabel: '',
  items: [],
  selected: '',
  onChange: () => {},
};

export { RadioButtonGroup };
