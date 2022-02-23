import type { ReactNode } from 'react';
import type { ToastProps } from 'react-bootstrap';
import { Toast as BootstrapToast } from 'react-bootstrap';
import { css } from 'styled-components';

import type { Values } from '@/types/Values';

import { parseSpacing } from './Box';
import { Inline } from './Inline';
import { Paragraph } from './Paragraph';
import { getValueFromTheme } from './theme';

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
    border-radius: 0;

    position: fixed;
    right: 0;
    top: ${parseSpacing(3)()};

    min-width: 30rem;
  }

  .toast-header {
    border-top-left-radius: 0;
    border-top-right-radius: 0;

    display: flex;
    justify-content: space-between;
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
  const shouldHaveWhiteText = ([
    ToastVariants.PRIMARY,
    ToastVariants.SUCCESS,
    ToastVariants.DANGER,
    ToastVariants.DARK,
  ] as string[]).includes(variant);

  return (
    <BootstrapToast
      className={`d-inline-block m-1 bg-${variant}`}
      css={VariantToStylesMap[variant]}
      autohide
      delay={5000}
      show={visible}
      onClose={onClose}
    >
      <Inline as={BootstrapToast.Header} spacing={3}>
        {header}
      </Inline>
      <Paragraph
        as={BootstrapToast.Body}
        color={shouldHaveWhiteText ? '#FFF' : 'inherit'}
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
