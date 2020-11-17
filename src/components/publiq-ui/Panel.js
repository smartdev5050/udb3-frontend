import PropTypes from 'prop-types';
import { getValueFromTheme } from './theme';
import { Stack, stackPropTypes, getStackProps } from './Stack';

const getValue = getValueFromTheme('panel');

const Panel = ({ children, className, ...props }) => (
  <Stack
    css={`
      border: 1px solid ${getValue('borderColor')};
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    `}
    {...getStackProps(props)}
    className={className}
    marginBottom={4}
  >
    {children}
  </Stack>
);

Panel.propTypes = {
  ...stackPropTypes,
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Panel };
