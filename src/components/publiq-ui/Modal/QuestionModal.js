import PropTypes from 'prop-types';
import { Modal as BootstrapModal } from 'react-bootstrap';
import { Button, ButtonVariants } from '../Button';

const QuestionModal = ({
  className,
  visible,
  title,
  confirmTitle,
  cancelTitle,
  onShow,
  onClose,
  onConfirm,
  children,
  size,
  confirmButtonDisabled,
}) => (
  <BootstrapModal
    className={className}
    show={visible}
    onShow={onShow}
    onHide={onClose}
    keyboard={false}
    css={`
      z-index: 2000;

      .modal-title {
        font-size: 1.067rem;
        font-weight: 700;
      }

      .modal {
        overflow-y: hidden;
      }

      .modal-content {
        border-radius: 0;
        max-height: 95vh;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
      }

      .modal-body {
        padding: 0;
      }
    `}
  >
    <BootstrapModal.Header closeButton>
      <BootstrapModal.Title hidden={!title}>{title}</BootstrapModal.Title>
    </BootstrapModal.Header>
    <BootstrapModal.Body>{children}</BootstrapModal.Body>
    <BootstrapModal.Footer>
      <Button variant={ButtonVariants.SECONDARY} onClick={onClose}>
        {cancelTitle}
      </Button>
      <Button
        variant={ButtonVariants.PRIMARY}
        onClick={onConfirm}
        disabled={confirmButtonDisabled}
      >
        {confirmTitle}
      </Button>
    </BootstrapModal.Footer>
  </BootstrapModal>
);

QuestionModal.propTypes = {
  className: PropTypes.string,
  visible: PropTypes.bool,
  title: PropTypes.string,
  confirmTitle: PropTypes.string,
  cancelTitle: PropTypes.string,
  onShow: PropTypes.func,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  children: PropTypes.node,
  size: PropTypes.string,
  confirmButtonDisabled: PropTypes.bool,
};

QuestionModal.defaultProps = {
  visible: false,
  confirmButtonDisabled: false,
  title: '',
  confirmTitle: 'Ok',
  cancelTitle: 'Cancel',
  onShow: () => {},
  onClose: () => {},
  onConfirm: () => {},
};

export { QuestionModal };
