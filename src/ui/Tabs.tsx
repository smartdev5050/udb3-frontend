import type { ReactNode, SyntheticEvent } from 'react';
import { Children } from 'react';
import {
  Tab as BootstrapTab,
  Tabs as BootstrapTabs,
  TabsProps,
} from 'react-bootstrap';

import type { BoxProps } from '@/ui/Box';
import { Box, getBoxProps, parseSpacing } from '@/ui/Box';

import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme(`tabs`);

type Props<T> = BoxProps & TabsProps & { activeBackgroundColor?: string };

const Tabs = <T,>({
  activeKey,
  onSelect,
  activeBackgroundColor,
  children: rawChildren,
  className,
  ...props
}: Props<T>) => {
  const children = Children.toArray(rawChildren).filter((child) => {
    // @ts-expect-error
    if (child.type !== Tab) {
      // eslint-disable-next-line no-console
      console.error(
        'Child of type',
        // @ts-expect-error
        child.type.name,
        'is not supported in Tabs component',
      );
      return false;
    }

    return true;
  });

  return (
    <Box className={className} {...getBoxProps(props)}>
      <BootstrapTabs
        activeKey={activeKey}
        onSelect={onSelect}
        css={`
          border-bottom: none;

          .nav-item:last-child {
            border-right: 1px solid ${getValue('borderColor')};
          }

          .nav-item {
            color: ${getValue('color')};
            border-radius: ${getValue('borderRadius')};
            padding: ${parseSpacing(3)} ${parseSpacing(4)};
            border-color: ${getValue('borderColor')};
            border-right: none;

            &.nav-link {
              border-bottom-left-radius: 0;
              border-bottom-right-radius: 0;
            }

            &.active {
              background-color: transparent;
              border-bottom-color: ${activeBackgroundColor ??
              getValue('activeTabBackgroundColor')};
              cursor: default;
              border-bottom: transparent;
            }

            &:hover {
              color: ${getValue('hoverColor')};
              border-color: transparent;
              background-color: ${getValue('hoverTabBackgroundColor')};
            }
          }
        `}
      >
        {children}
      </BootstrapTabs>
    </Box>
  );
};

type TabProps = {
  eventKey: string;
  title: ReactNode;
  children?: ReactNode;
};

const Tab = ({ eventKey, title, children }: TabProps) => {
  return (
    <BootstrapTab eventKey={eventKey} title={title}>
      {children}
    </BootstrapTab>
  );
};

Tabs.Tab = Tab;

export { Tabs };
