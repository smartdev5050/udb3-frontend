import type { Values } from '@/types/Values';

import type { BoxProps } from './Box';
import { Icon, Icons } from './Icon';
import { Stack } from './Stack';
import { Text } from './Text';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme(`toggleBox`);

type Props = BoxProps & {
  active: boolean;
  icon: Values<typeof Icons>;
  text: string;
};

const ToggleBox = ({ children, onClick, active, icon, text }: Props) => {
  return (
    <Stack
      onClick={onClick}
      padding={5}
      alignItems="center"
      position="relative"
      backgroundColor={getValue(
        active ? 'activeBackgroundColor' : 'backgroundColor',
      )}
      width="40%"
      css={`
        border: 1px solid ${getValue('borderColor')};
        &:hover {
          cursor: pointer;
        }
      `}
    >
      {active && (
        <Icon
          name={Icons.CHECK_CIRCLE}
          backgroundColor="white"
          borderRadius="50%"
          color={getValue('iconCheckColor')}
          position="absolute"
          top={-7}
          left={-6}
          width={15}
          height={15}
        />
      )}
      {icon && (
        <Icon
          name={icon}
          color={getValue('iconColor')}
          width={30}
          height={30}
        />
      )}
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
