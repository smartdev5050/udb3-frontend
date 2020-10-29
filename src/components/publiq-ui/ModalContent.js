import PropTypes from 'prop-types';
import { Modal as BootstrapModal } from 'react-bootstrap';
import { Button, ButtonVariants } from './Button';
import styled from 'styled-components';

const StyledBootstrapModal = styled(BootstrapModal)``;

const handleClose = () => {};

const ModalContent = ({ visible }) => {
  return (
    <StyledBootstrapModal
      show={visible}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <StyledBootstrapModal.Header closeButton>
        <StyledBootstrapModal.Title>Modal title</StyledBootstrapModal.Title>
      </StyledBootstrapModal.Header>
      <StyledBootstrapModal.Body>
        I will not close if you click outside me. Don't even try to press escape
        key.
      </StyledBootstrapModal.Body>
      <StyledBootstrapModal.Footer>
        <Button variant={ButtonVariants.SECONDARY} onClick={handleClose}>
          Close
        </Button>
        <Button variant={ButtonVariants.PRIMARY}>Understood</Button>
      </StyledBootstrapModal.Footer>
    </StyledBootstrapModal>
  );
};

ModalContent.propTypes = {
  visible: PropTypes.bool,
};

ModalContent.defaultProps = {
  visible: false,
};

export { ModalContent };
