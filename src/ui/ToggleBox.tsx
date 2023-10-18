import { ReactNode } from 'react';

import { parseSpacing } from './Box';
import { Icon, Icons } from './Icon';
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
    <svg
      css={`
        position: absolute;
        top: 12px;
        left: 12px;
      `}
      width="30"
      height="30"
      viewBox="0 0 35 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1.5"
        y="1"
        width="32"
        height="32"
        rx="5.20812"
        fill="#6BCD69"
        css={`
          fill: ${active ? '#6BCD69' : '#fff'};
        `}
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8.21465 18.272C7.47575 17.5346 7.47575 16.3374 8.21465 15.6C8.95145 14.8647 10.1445 14.8647 10.8813 15.6L14.1529 18.8651C14.5613 19.2727 15.2226 19.2727 15.631 18.8651L24.2466 10.2667C24.9835 9.53134 26.1765 9.53134 26.9133 10.2667C27.6522 11.0041 27.6522 12.2012 26.9133 12.9387L15.9968 23.8334C15.3862 24.4427 14.3977 24.4427 13.7872 23.8334L8.21465 18.272Z"
        fill="white"
      />
      <rect
        x="1.5"
        y="1"
        width="32"
        height="32"
        rx="5.20812"
        stroke="#6BCD69"
        stroke-width="1.82284"
        css={`
          &:hover {
            stroke: #fff;
          }
        `}
      />
    </svg>
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
        position: relative;
        border: 1px solid
          ${active ? getValue('activeBorderColor') : getValue('borderColor')};
        cursor: ${disabled ? 'not-allowed' : 'pointer'};

        &:hover {
          border-color: ${disabled
            ? 'transparent'
            : getValue('hoverBorderColor')};
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
