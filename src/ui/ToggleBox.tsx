import { ReactNode } from 'react';

import { parseSpacing } from './Box';
import type { StackProps } from './Stack';
import { getStackProps, Stack } from './Stack';
import { Text } from './Text';
import { getGlobalBorderRadius, getValueFromTheme } from './theme';

const getValue = getValueFromTheme(`toggleBox`);

type SuccessIconProps = {
  active?: boolean;
};

const SuccessIcon = ({ active }: SuccessIconProps) => {
  return (
    <Stack
      className="success-icon-wrapper"
      justifyContent="center"
      alignItems="center"
      width={30}
      height={30}
      position="absolute"
      top="12px"
      left="12px"
      backgroundColor={active ? getValue('activeBorderColor') : 'none'}
      css={`
        border: 1.8px solid
          ${active ? getValue('activeBorderColor') : getValue('borderColor')};

        &:hover {
          border-color: ${getValue('activeBorderColor')};
        }
      `}
      borderRadius="5px"
    >
      <svg
        width="21"
        height="16"
        viewBox="0 0 21 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.21465 9.272C0.475754 8.53458 0.475752 7.33743 1.21465 6.60001C1.95145 5.86467 3.1445 5.86467 3.88131 6.60001L7.15291 9.86508C7.56133 10.2727 8.22263 10.2727 8.63104 9.86508L17.2466 1.26667C17.9835 0.531335 19.1765 0.531336 19.9133 1.26667C20.6522 2.00409 20.6522 3.20125 19.9133 3.93867L8.99676 14.8334C8.38625 15.4427 7.39771 15.4427 6.78719 14.8334L1.21465 9.272Z"
          fill="white"
        />
      </svg>
    </Stack>
  );
};

type Props = StackProps & {
  active: boolean;
  icon?: JSX.Element;
  text: ReactNode;
  disabled?: boolean;
};

const ToggleBox = ({
  children,
  onClick,
  active,
  icon,
  text,
  disabled,
  ...props
}: Props) => {
  return (
    <Stack
      forwardedAs="button"
      onClick={onClick}
      padding={5}
      alignItems="center"
      position="relative"
      spacing={3}
      backgroundColor={getValue(
        active ? 'activeBackgroundColor' : 'backgroundColor',
      )}
      minWidth={parseSpacing(8)}
      borderRadius={getGlobalBorderRadius}
      disabled={disabled}
      css={`
        border: 1px solid
          ${active ? getValue('activeBorderColor') : getValue('borderColor')};
        cursor: ${disabled ? 'not-allowed' : 'pointer'};

        svg path.icon-hover-color-stroke {
          stroke: ${active
            ? getValue('activeBorderColor')
            : getValue('borderColor')};
        }

        svg path.icon-hover-color-fill {
          fill: ${active
            ? getValue('activeBorderColor')
            : getValue('borderColor')};
        }

        &:hover {
          .success-icon-wrapper {
            border-color: ${disabled && !active
              ? getValue('borderColor')
              : getValue('hoverBorderColor')};
          }
          border-color: ${disabled && !active
            ? getValue('borderColor')
            : getValue('hoverBorderColor')};

          svg path.icon-hover-color-stroke {
            stroke: ${disabled && !active
              ? getValue('borderColor')
              : getValue('activeBorderColor')};
          }

          svg path.icon-hover-color-fill {
            fill: ${disabled && !active
              ? getValue('borderColor')
              : getValue('activeBorderColor')};
          }
        }
      `}
      {...getStackProps(props)}
    >
      <SuccessIcon active={active} />
      {icon && <Stack>{icon}</Stack>}
      {text && (
        <Text
          color={getValue(active ? 'activeTextColor' : 'textColor')}
          fontWeight={700}
          fontSize="16px"
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
