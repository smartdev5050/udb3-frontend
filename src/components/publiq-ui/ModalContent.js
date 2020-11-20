import PropTypes from 'prop-types';
import { Modal as BootstrapModal } from 'react-bootstrap';

const ModalContent = ({
  visible,
  title,
  onShow,
  onClose,
  children,
  className,
}) => (
  <BootstrapModal
    className={className}
    show={visible}
    onShow={onShow}
    onHide={onClose}
    keyboard={false}
    size="xl"
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
  </BootstrapModal>
);

ModalContent.propTypes = {
  className: PropTypes.string,
  visible: PropTypes.bool,
  title: PropTypes.string,
  onShow: PropTypes.func,
  onClose: PropTypes.func,
  children: PropTypes.node,
};

ModalContent.defaultProps = {
  visible: false,
  title: '',
  onShow: () => {},
  onClose: () => {},
};

export { ModalContent };
