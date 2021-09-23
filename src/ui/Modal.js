import PropTypes from 'prop-types';

import { ContentModal } from './Modal/ContentModal';
import { QuestionModal } from './Modal/QuestionModal';

const ModalVariants = {
  QUESTION: 'question',
  CONTENT: 'content',
};

const ModalSizes = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
};

const Components = {
  [ModalVariants.QUESTION]: QuestionModal,
  [ModalVariants.CONTENT]: ContentModal,
};

const Modal = ({ variant, ...props }) => {
  const ModalVariant = Components[variant];
  if (!ModalVariant) return null;
  return <ModalVariant {...props} />;
};

Modal.propTypes = {
  variant: PropTypes.oneOf(Object.values(ModalVariants)),
  size: PropTypes.oneOf(Object.values(ModalSizes)),
  className: PropTypes.string,
  visible: PropTypes.bool,
  title: PropTypes.string,
  onShow: PropTypes.func,
  onClose: PropTypes.func,
  children: PropTypes.node,
  confirmTitle: PropTypes.string,
  cancelTitle: PropTypes.string,
  onConfirm: PropTypes.func,
  confirmButtonDisabled: PropTypes.bool,
};

Modal.defaultProps = {
  variant: ModalVariants.CONTENT,
};

export { Modal, ModalSizes, ModalVariants };
