import { Tab as BootstrapTab, Tabs as BootstrapTabs } from 'react-bootstrap';
import { getValueFromTheme } from './theme';
import * as PropTypes from 'prop-types';
import { Children } from 'react';
import { Box } from '@/ui/Box';

const getValue = getValueFromTheme(`tabs`);

const Tabs = ({ activeKey, onSelect, children: rawChildren }) => {
  const children = Children.toArray(rawChildren).filter((child) => {
    if (child.type !== Tab) {
      console.error(
        'Child of type',
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
          padding: 10px 15px;
          margin-right: 2px;

          &:hover {
            color: ${getValue('hoverColor')};
            border-color: transparent;
            background-color: ${getValue('hoverTabBackgroundColor')};
          }

          &.active,
          &.active:hover {
            color: ${getValue('activeTabColor')};
            background-color: ${getValue('activeTabBackgroundColor')};
            border-color: ${getValue('borderColor')};
            border-bottom-color: ${getValue('activeTabBackgroundColor')};
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
