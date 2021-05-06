import PropTypes from 'prop-types';
import type { SyntheticEvent } from 'react';
import { Children } from 'react';
import { Tab as BootstrapTab, Tabs as BootstrapTabs } from 'react-bootstrap';

import type { BoxProps } from '@/ui/Box';
import { parseSpacing } from '@/ui/Box';

import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme(`tabs`);

type Props = BoxProps & {
  activeKey: unknown;
  onSelect: (eventKey: string | null, e: SyntheticEvent<unknown>) => void;
  activeBackgroundColor: string;
};

const Tabs = ({
  activeKey,
  onSelect,
  activeBackgroundColor,
  children: rawChildren,
}: Props) => {
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
    <BootstrapTabs
      activeKey={activeKey}
      onSelect={onSelect}
      css={`
        border-bottom-color: ${getValue('borderColor')};

        .nav-item {
          color: ${getValue('color')};
          border-radius: ${getValue('borderRadius')};
          padding: ${parseSpacing(3)} ${parseSpacing(4)};
          margin-right: ${parseSpacing(1)};

          &:hover {
            color: ${getValue('hoverColor')};
            border-color: transparent;
            background-color: ${getValue('hoverTabBackgroundColor')};
          }

          &.active,
          &.active:hover {
            color: ${getValue('activeTabColor')};
            background-color: ${activeBackgroundColor ??
            getValue('activeTabBackgroundColor')};
            border-color: ${getValue('borderColor')};
            border-bottom-color: ${activeBackgroundColor ??
            getValue('activeTabBackgroundColor')};
            cursor: default;
          }
        }
      `}
    >
      {children}
    </BootstrapTabs>
  );
};

Tabs.propTypes = {
  activeKey: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  activeBackgroundColor: PropTypes.string,
  children: PropTypes.node,
};

const Tab = ({ eventKey, title }) => {
  return <BootstrapTab eventKey={eventKey} title={title} />;
};

Tab.propTypes = {
  eventKey: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

Tabs.Tab = Tab;

export { Tabs };
