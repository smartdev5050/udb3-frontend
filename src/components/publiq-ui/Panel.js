import PropTypes from 'prop-types';
import { getValueFromTheme } from './theme';
import { Stack, stackPropTypes, getStackProps } from './Stack';
import { Children } from 'react';

const getValue = getValueFromTheme('panel');

const Panel = ({ children, className, ...props }) => {
  const parsedChildren =
    Children.count(children) === 1 ? <>{children}</> : children;
  return (
    <Stack
      css={`
        border: 1px solid ${getValue('borderColor')};
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
      `}
      className={className}
      {...getStackProps(props)}
    >
      {parsedChildren}
    </Stack>
  );
};

Panel.propTypes = {
  ...stackPropTypes,
  className: PropTypes.string,
  children: PropTypes.node,
};

const getValueForPanelFooter = getValueFromTheme('panelFooter');

const PanelFooter = ({ children, className, ...props }) => {
  const parsedChildren =
    Children.count(children) === 1 ? <>{children}</> : children;
  return (
    <Stack
      forwardedAs="footer"
      className={className}
      backgroundColor={getValueForPanelFooter('backgroundColor')}
      css={`
        border-top: 1px solid ${getValueForPanelFooter('borderColor')};
        background-color: ${getValueForPanelFooter('backgroundColor')};
      `}
      padding={5}
      paddingTop={4}
      {...getStackProps(props)}
    >
      {parsedChildren}
    </Stack>
  );
};

PanelFooter.propTypes = {
  ...stackPropTypes,
  className: PropTypes.string,
  children: PropTypes.node,
};

Panel.Footer = PanelFooter;

export { Panel };
