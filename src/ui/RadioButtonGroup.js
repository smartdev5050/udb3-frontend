import PropTypes from 'prop-types';

import { Label, LabelVariants } from './Label';
import { RadioButtonWithLabel } from './RadioButtonWithLabel';
import { getStackProps, Stack } from './Stack';

const RadioButtonGroup = ({
  name,
  groupLabel,
  items,
  selected,
  className,
  onChange,
  ...props
}) => {
  return (
    <Stack className={className} as="div" spacing={3} {...getStackProps(props)}>
      {groupLabel ? (
        <Label variant={LabelVariants.BOLD}>{groupLabel}</Label>
      ) : null}
      <Stack role="radiogroup" as="ul" spacing={2}>
        {items.map((item) => (
          <RadioButtonWithLabel
            key={item.value}
            value={item.value}
            checked={selected === item.value}
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
};

export { RadioButtonGroup };
