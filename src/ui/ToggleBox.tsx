import { parseSpacing } from './Box';
import { Icon, Icons } from './Icon';
import type { StackProps } from './Stack';
import { getStackProps, Stack } from './Stack';
import { Text } from './Text';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme(`toggleBox`);

type Props = StackProps & {
  active: boolean;
  icon?: JSX.Element;
  text: string;
};

const ToggleBox = ({
  children,
  onClick,
  active,
  icon,
  text,
  ...props
}: Props) => {
  return (
    <Stack
      forwardedAs="button"
      onClick={onClick}
      padding={5.5}
      alignItems="center"
      position="relative"
      spacing={3}
      backgroundColor={getValue(
        active ? 'activeBackgroundColor' : 'backgroundColor',
      )}
      minWidth={parseSpacing(8)}
      borderRadius="0.5rem"
      css={`
        border: none;
        box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
      `}
      {...getStackProps(props)}
    >
      {active && (
        <Icon
          css={`
            position: absolute;
            top: -5px;
            left: -5px;
            color: ${getValue('iconCheckColor')};
          `}
          name={Icons.CHECK_CIRCLE}
        />
      )}
      {icon && <Stack>{icon}</Stack>}
      {text && (
        <Text
          color={getValue(active ? 'activeTextColor' : 'textColor')}
          fontWeight={700}
          fontSize="16px"
          css={`
            text-decoration: ${active ? 'underline' : 'none'};
            &:hover {
              text-decoration: underline;
            }
          `}
        >
          {text}
        </Text>
      )}
      {children}
    </Stack>
  );
};

ToggleBox.defaultProps = {
  active: false,
  icon: undefined,
  text: '',
};

export { ToggleBox };
