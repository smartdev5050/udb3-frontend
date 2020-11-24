import PropTypes from 'prop-types';
import { getStackProps, Stack, stackPropTypes } from './Stack';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme('page');

const Page = ({ children, className, ...props }) => (
  <Stack
    forwardedAs="main"
    className={className}
    css={`
      background-color: ${getValue('backgroundColor')};
      width: 100%;
      min-height: 100vh;
    `}
    paddingLeft={4}
    paddingRight={4}
    {...getStackProps(props)}
  >
    {children}
  </Stack>
);

Page.propTypes = {
  ...stackPropTypes,
  children: PropTypes.node,
  className: PropTypes.string,
};

export { Page };
