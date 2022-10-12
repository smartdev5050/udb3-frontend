import type { ReactNode } from 'react';
import { Toast as BootstrapToast } from 'react-bootstrap';
import { css } from 'styled-components';

import type { Values } from '@/types/Values';

import { parseSpacing } from './Box';
import { Inline } from './Inline';
import { Paragraph } from './Paragraph';
import { getGlobalBorderRadius, getValueFromTheme } from './theme';

const ToastVariants = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
  INFO: 'info',
  LIGHT: 'light',
  DARK: 'dark',
} as const;

const getValue = getValueFromTheme('toast');

const commonCss = css`
  &.toast {
    border-radius: ${getGlobalBorderRadius};

    position: fixed;
    right: ${parseSpacing(3)()};
    top: ${parseSpacing(3)()};

    z-index: ${getValue('zIndex')};

    min-width: ${parseSpacing(8)()};
  }

  .toast-header {
    border-top-left-radius: 0;
    border-top-right-radius: 0;

    border-bottom: none;

    background-color: transparent;

    display: flex;
    justify-content: space-between;
    align-items: center;

    button.close {
      color: #fff;
    }
  }
`;

const VariantToStylesMap = {
  [ToastVariants.PRIMARY]: css`
    ${commonCss}

    &.bg-primary {
      background-color: ${getValue('primary.backgroundColor')} !important;
    }
  `,
  [ToastVariants.SECONDARY]: css`
    ${commonCss}

    &.bg-secondary {
      color: ${getValue('secondary.color')} !important;
      background-color: ${getValue('secondary.backgroundColor')} !important;
    }
  `,
  [ToastVariants.SUCCESS]: css`
    ${commonCss}

    &.bg-success {
      background-color: ${getValue('success.backgroundColor')} !important;
    }
  `,
  [ToastVariants.DANGER]: css`
    ${commonCss}

    &.bg-danger {
      background-color: ${getValue('danger.backgroundColor')} !important;
    }
  `,
};

type Props = {
  variant: Values<typeof ToastVariants>;
  header: ReactNode;
  body: string;
  visible?: boolean;
  onClose?: () => void;
};

const Toast = ({ variant, visible, header, body, onClose }: Props) => {
  return (
    <BootstrapToast
      className={`d-inline-block m-1 bg-${variant}`}
      css={VariantToStylesMap[variant]}
      autohide
      delay={5000}
      show={visible}
      onClose={onClose}
    >
      <Inline
        as={BootstrapToast.Header}
        spacing={3}
        color={getValue('textColor.light')}
      >
        {header}
      </Inline>
      <Paragraph
        as={BootstrapToast.Body}
        backgroundColor="rgba(255,255,255,.85)"
        color={getValue('textColor.dark')}
      >
        {body}
      </Paragraph>
    </BootstrapToast>
  );
};

Toast.defaultProps = {
  variant: ToastVariants.PRIMARY,
  visible: true,
  title: '',
  body: '',
};

export { Toast, ToastVariants };
