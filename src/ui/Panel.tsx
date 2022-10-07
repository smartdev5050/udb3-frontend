import { Children } from 'react';

import type { StackProps } from './Stack';
import { getStackProps, Stack } from './Stack';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme('panel');

type PanelProps = StackProps;

const Panel = ({ children, className, ...props }: PanelProps) => {
  const parsedChildren =
    Children.count(children) === 1 ? <>{children}</> : children;
  return (
    <Stack
      css={`
        border: 1px solid ${getValue('borderColor')};
        border-radius: 8px;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
      `}
      className={className}
      {...getStackProps(props)}
    >
      {parsedChildren}
    </Stack>
  );
};

const getValueForPanelFooter = getValueFromTheme('panelFooter');

type PanelFooterProps = StackProps;

const PanelFooter = ({ children, className, ...props }: PanelFooterProps) => {
  const parsedChildren =
    Children.count(children) === 1 ? <>{children}</> : children;
  return (
    <Stack
      forwardedAs="footer"
      className={className}
      backgroundColor={getValueForPanelFooter('backgroundColor')}
      css={`
        border-top: 1px solid ${getValueForPanelFooter('borderColor')};
        border-radius: 8px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
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

Panel.Footer = PanelFooter;

export type { PanelProps };
export { Panel };
