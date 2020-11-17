import PropTypes from 'prop-types';
import { getValueFromTheme } from './theme';
import { Stack, getStackProps, stackPropTypes } from './Stack';

const getValue = getValueFromTheme('panelFooter');

const PanelFooter = ({ children, className, ...props }) => (
  <Stack
    as="footer"
    className={className}
    {...getStackProps(props)}
    css={`
      padding: 0.75rem 1rem;
      background-color: ${getValue('backgroundColor')};
      border-top: 1px solid ${getValue('borderColor')};
    `}
  >
    {children}
  </Stack>
);

PanelFooter.propTypes = {
  ...stackPropTypes,
  className: PropTypes.string,
  children: PropTypes.node,
};

export { PanelFooter };
