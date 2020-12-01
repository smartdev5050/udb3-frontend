import { QuestionModal } from './Modal/QuestionModal';
import { ContentModal } from './Modal/ContentModal';
import PropTypes from 'prop-types';

const ModalVariants = {
  QUESTION: 'question',
  CONTENT: 'content',
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
  variant: PropTypes.string,
  className: PropTypes.string,
  visible: PropTypes.bool,
  title: PropTypes.string,
  onShow: PropTypes.func,
  onClose: PropTypes.func,
  children: PropTypes.node,
  confirmTitle: PropTypes.string,
  cancelTitle: PropTypes.string,
  onConfirm: PropTypes.func,
};

Modal.defaultProps = {
  variant: ModalVariants.CONTENT,
};

export { Modal, ModalVariants };
