import PropTypes from 'prop-types';
import { Modal as BootstrapModal } from 'react-bootstrap';

import { getGlobalBorderRadius, getValueFromTheme } from '../theme';

const getValueForModal = getValueFromTheme('modal');

const ContentModal = ({
  visible,
  title,
  scrollable,
  onShow,
  onClose,
  children,
  size,
  className,
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
  </BootstrapModal>
);

ContentModal.propTypes = {
  className: PropTypes.string,
  visible: PropTypes.bool,
  title: PropTypes.string,
  onShow: PropTypes.func,
  onClose: PropTypes.func,
  scrollable: PropTypes.bool,
  children: PropTypes.node,
  size: PropTypes.string,
};

ContentModal.defaultProps = {
  visible: false,
  title: '',
  size: 'xl',
  scrollable: true,
  onShow: () => {},
  onClose: () => {},
};

export { ContentModal };
