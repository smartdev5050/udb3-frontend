import PropTypes from 'prop-types';
import { Modal as BootstrapModal } from 'react-bootstrap';
import styled from 'styled-components';

const StyledBootstrapModal = styled(BootstrapModal)`
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
`;

const ModalContent = ({ visible, title, onClose, children }) => {
  return (
    <StyledBootstrapModal
      show={visible}
      onHide={onClose}
      backdrop="static"
      keyboard={false}
      size="xl"
    >
      <StyledBootstrapModal.Header closeButton>
        <StyledBootstrapModal.Title as="h5" hidden={!title}>
          {title}
        </StyledBootstrapModal.Title>
      </StyledBootstrapModal.Header>
      <StyledBootstrapModal.Body>{children}</StyledBootstrapModal.Body>
    </StyledBootstrapModal>
  );
};

ModalContent.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.node,
};

ModalContent.defaultProps = {
  visible: false,
  title: '',
  onClose: () => {},
};

export { ModalContent };
