import PropTypes from 'prop-types';
import { Modal as BootstrapModal } from 'react-bootstrap';

import { Button, ButtonVariants } from '../Button';
import { getGlobalBorderRadius, getValueFromTheme } from '../theme';

const getValueForModal = getValueFromTheme('modal');

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
  scrollable,
  size,
  confirmButtonDisabled,
}) => (
  <BootstrapModal
    className={className}
    show={visible}
    onShow={onShow}
    onHide={onClose}
    scrollable={scrollable}
    keyboard={false}
    size={size}
    css={`
      z-index: ${getValueForModal('zIndex')};

      .modal-title {
        font-size: 1.067rem;
        font-weight: 700;
      }

      .modal {
        overflow-y: hidden;
      }

      .modal-content {
        border-radius: ${getGlobalBorderRadius};
        max-height: 95vh;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
        overflow: visible;
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
  scrollable: PropTypes.bool,
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
  size: 'sm',
  scrollable: true,
};

export { QuestionModal };
