import PropTypes from 'prop-types';
import { Modal as BootstrapModal } from 'react-bootstrap';
import { Button, ButtonVariants } from './Button';
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

const ModalQuestion = ({
  visible,
  title,
  confirmTitle,
  cancelTitle,
  onClose,
  onConfirm,
  children,
}) => {
  return (
    <StyledBootstrapModal
      show={visible}
      onHide={onClose}
      backdrop="static"
      keyboard={false}
    >
      <StyledBootstrapModal.Header closeButton>
        <StyledBootstrapModal.Title hidden={!title}>
          {title}
        </StyledBootstrapModal.Title>
      </StyledBootstrapModal.Header>
      <StyledBootstrapModal.Body>{children}</StyledBootstrapModal.Body>
      <StyledBootstrapModal.Footer>
        <Button variant={ButtonVariants.SECONDARY} onClick={onClose}>
          {cancelTitle}
        </Button>
        <Button variant={ButtonVariants.PRIMARY} onClick={onConfirm}>
          {confirmTitle}
        </Button>
      </StyledBootstrapModal.Footer>
    </StyledBootstrapModal>
  );
};

ModalQuestion.propTypes = {
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
