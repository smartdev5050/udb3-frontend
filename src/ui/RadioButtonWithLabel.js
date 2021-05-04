import PropTypes from 'prop-types';

import { getInlineProps, Inline, inlinePropTypes } from './Inline';
import { Label } from './Label';
import {
  RadioButton,
  radioButtonDefaultProps,
  radioButtonPropTypes,
} from './RadioButton';
import { Stack } from './Stack';
import { Text } from './Text';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme('radioButtonWithLabel');

const RadioButtonWithLabel = ({
  id,
  name,
  disabled,
  onChange,
  label,
  info,
  value,
  checked,
  className,
  ...props
}) => {
  return (
    <Inline
      className={className}
      alignItems="flex-start"
      spacing={3}
      as="li"
      {...getInlineProps(props)}
    >
      <RadioButton
        id={id}
        onChange={onChange}
        value={value}
        name={name}
        checked={checked}
        css={`
          margin-top: 0.36rem;
        `}
      />
      <Stack>
        <Label cursor="pointer" htmlFor={id}>
          {label}
        </Label>
        {!!info && <Text color={getValue('infoTextColor')}>{info}</Text>}
      </Stack>
    </Inline>
  );
};

RadioButtonWithLabel.propTypes = {
  ...inlinePropTypes,
  ...radioButtonPropTypes,
  label: PropTypes.node,
  info: PropTypes.string,
};

RadioButtonWithLabel.defaultprops = {
  ...radioButtonDefaultProps,
};

export { RadioButtonWithLabel };
