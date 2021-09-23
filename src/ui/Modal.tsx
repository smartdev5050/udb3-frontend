import type { ReactNode } from 'react';

import type { Values } from '@/types/Values';

import { ContentModal } from './Modal/ContentModal';
import { QuestionModal } from './Modal/QuestionModal';

const ModalVariants = {
  QUESTION: 'question',
  CONTENT: 'content',
} as const;

const ModalSizes = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
} as const;

const Components = {
  [ModalVariants.QUESTION]: QuestionModal,
  [ModalVariants.CONTENT]: ContentModal,
};

type ModalProps = {
  visible?: boolean;
  confirmButtonDisabled?: boolean;
  title: string;
  confirmTitle?: string;
  cancelTitle?: string;
  size?: Values<typeof ModalSizes>;
  onShow?: () => void;
  onClose?: () => void;
  onConfirm?: () => void;
  children?: ReactNode;
  className?: string;
};

type Props = ModalProps & {
  variant: Values<typeof ModalVariants>;
};

const Modal = ({ variant, ...props }: Props) => {
  const ModalVariant = Components[variant];
  if (!ModalVariant) return null;
  return <ModalVariant {...props} />;
};

Modal.defaultProps = {
  variant: ModalVariants.CONTENT,
};

export { Modal, ModalSizes, ModalVariants };
export type { ModalProps };
