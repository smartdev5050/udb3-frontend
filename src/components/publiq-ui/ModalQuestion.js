import PropTypes from 'prop-types';
import { Modal as BootstrapModal } from 'react-bootstrap';
import { Button, ButtonVariants } from './Button';

const ModalQuestion = ({
  className,
  visible,
  title,
  confirmTitle,
  cancelTitle,
  onClose,
  onConfirm,
  children,
}) => (
  <BootstrapModal
    className={className}
    show={visible}
    onHide={onClose}
    keyboard={false}
    css={`
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
      <Button variant={ButtonVariants.PRIMARY} onClick={onConfirm}>
        {confirmTitle}
      </Button>
    </BootstrapModal.Footer>
  </BootstrapModal>
);

ModalQuestion.propTypes = {
  className: PropTypes.string,
  visible: PropTypes.bool,
  title: PropTypes.string,
  confirmTitle: PropTypes.string,
  cancelTitle: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  children: PropTypes.node,
};

ModalQuestion.defaultProps = {
  visible: false,
  title: '',
  confirmTitle: 'Ok',
  cancelTitle: 'Cancel',
  onClose: () => {},
  onConfirm: () => {},
};

export { ModalQuestion };
