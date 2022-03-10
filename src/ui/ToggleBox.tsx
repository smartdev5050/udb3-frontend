import type { Values } from '@/types/Values';

import type { BoxProps } from './Box';
import { Box } from './Box';
import { Icon, Icons } from './Icon';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme(`toggleBox`);

type Props = BoxProps & {
  active: boolean;
  icon: Values<typeof Icons>;
  text: string;
};

const ToggleBox = ({ children, onClick, active, icon, text }: Props) => {
  return (
    <Box
      onClick={onClick}
      padding={5}
      display="flex"
      flexWrap="wrap"
      flexDirection="column"
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
          css="color: green;position: absolute;top:-13px;left:-6px;"
        />
      )}
      {icon && <Icon name={icon} width={30} height={30} />}
      {text && (
        <span
          css={`
            color: ${getValue(active ? 'activeTextColor' : 'textColor')};
            text-decoration: ${active ? 'underline' : 'none'};
            font-size: 16px;
            font-weight: 700;

            &:hover {
              text-decoration: underline;
            }
          `}
        >
          {text}
        </span>
      )}
      {children}
    </Box>
  );
};

ToggleBox.defaultProps = {
  active: false,
  icon: undefined,
  text: '',
};

export { ToggleBox };
