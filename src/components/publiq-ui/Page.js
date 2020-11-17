import PropTypes from 'prop-types';
import { Stack } from './Stack';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme('page');

const Page = ({ children, className }) => (
  <Stack
    as="main"
    className={className}
    css={`
      background-color: ${getValue('backgroundColor')};
      width: 100%;
      min-height: 100vh;
    `}
  >
    {children}
  </Stack>
);

Page.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export { Page };
