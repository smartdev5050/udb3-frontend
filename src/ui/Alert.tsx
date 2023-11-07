import type { Values } from '@/types/Values';
import { parseSpacing } from '@/ui/Box';

import { Icon, Icons } from './Icon';
import type { InlineProps } from './Inline';
import { getInlineProps, Inline } from './Inline';
import { Stack } from './Stack';
import { Text } from './Text';
import { getGlobalBorderRadius, getValueFromTheme } from './theme';

const IconWarning = () => {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      viewBox="0 0 24 24"
    >
      <g clip-path="url(#a)">
        <g clip-path="url(#b)">
          <path
            d="M1 21h22L12 2 1 21Zm12-3h-2v-2h2v2Zm0-4h-2v-4h2v4Z"
            fill="#E69336"
          />
        </g>
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
        <clipPath id="b">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

const IconSuccess = () => {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      viewBox="0 0 24 24"
    >
      <g clip-path="url(#a)">
        <path
          d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z"
          fill="#6BCD69"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

const IconInfo = () => {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      viewBox="0 0 16 20"
    >
      <path
        d="M14 14V9c0-3.07-1.64-5.64-4.5-6.32V2C9.5 1.17 8.83.5 8 .5S6.5 1.17 6.5 2v.68C3.63 3.36 2 5.92 2 9v5l-2 2v1h16v-1l-2-2Zm-5 0H7v-2h2v2Zm0-4H7V6h2v4ZM8 20c1.1 0 2-.9 2-2H6a2 2 0 0 0 2 2Z"
        fill="#3868EC"
      />
    </svg>
  );
};

const IconError = () => {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      viewBox="0 0 24 24"
    >
      <g clip-path="url(#a)">
        <path
          d="M11 15h2v2h-2v-2Zm0-8h2v6h-2V7Zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2ZM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8Z"
          fill="#DD5242"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

const AlertVariants = {
  PRIMARY: 'primary',
  INFO: 'info',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
  DARK: 'dark',
} as const;

const AlertVariantIconsMap = {
  [AlertVariants.PRIMARY]: <IconInfo />,
  [AlertVariants.SUCCESS]: <IconSuccess />,
  [AlertVariants.WARNING]: <IconWarning />,
  [AlertVariants.DANGER]: <IconError />,
};

const getValue = getValueFromTheme(`alert`);

type AlertProps = InlineProps & {
  variant?: Values<typeof AlertVariants>;
  visible?: boolean;
  fullWidth?: boolean;
};

const Alert = ({
  variant,
  visible,
  children,
  fullWidth,
  ...props
}: AlertProps) => {
  return (
    <Inline
      {...getInlineProps(props)}
      role="alert"
      alignSelf={fullWidth ? 'normal' : 'flex-start'}
      display={visible ? 'flex' : 'none'}
    >
      <Stack
        padding={4}
        borderRadius={getValue('borderRadius')}
        variant={variant}
        backgroundColor={getValue(`backgroundColor.${variant}`)}
        css={`
          position: relative;
          border: 1px solid ${getValue(`borderColor.${variant}`)};
          &::before {
            position: absolute;
            content: '';
            top: 0;
            left: 0;
            width: 6px;
            height: 100%;
            background-color: ${getValue(`borderColor.${variant}`)};
            display: block;
            border-top-left-radius: ${getValue('borderRadius')};
            border-bottom-left-radius: ${getValue('borderRadius')};
          }
        `}
      >
        <Inline spacing={3} alignItems="flex-start">
          <Stack>{AlertVariantIconsMap[variant]}</Stack>
          {typeof children !== 'string' ? (
            <Text>{children}</Text>
          ) : (
            <Text
              dangerouslySetInnerHTML={{ __html: children as string }}
              css={`
                strong {
                  font-weight: bold;
                }

                ul {
                  list-style-type: disc;
                  margin-bottom: ${parseSpacing(4)};

                  li {
                    margin-left: ${parseSpacing(5)};
                  }
                }
              `}
            />
          )}
        </Inline>
      </Stack>
    </Inline>
  );
};

Alert.defaultProps = {
  visible: true,
  variant: AlertVariants.PRIMARY,
};

export { Alert, AlertVariants };
