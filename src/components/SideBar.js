import PropTypes from 'prop-types';
import { Stack } from './publiq-ui/Stack';
import { Link } from './publiq-ui/Link';
import { List } from './publiq-ui/List';
import { useTranslation } from 'react-i18next';
import { Icon, Icons } from './publiq-ui/Icon';
import { getValueFromTheme } from './publiq-ui/theme';
import { ListItem } from './publiq-ui/ListItem';
import { Box } from './publiq-ui/Box';
import { Title } from './publiq-ui/Title';
import { Button } from './publiq-ui/Button';
import { Logo } from './publiq-ui/Logo';
import styled, { css } from 'styled-components';
import { useState } from 'react';
import { Inline } from './publiq-ui/Inline';
import { JobLogger } from './JobLogger';

const getValueForMenuItem = getValueFromTheme('menuItem');
const getValueForSideBar = getValueFromTheme('sideBar');
const getValueForMenu = getValueFromTheme('menu');

const listItemCSS = css`
  width: 100%;
  &:hover {
    background-color: ${getValueForMenuItem('hover.backgroundColor')};
  }
`;

const StyledLink = styled(Link)`
  ${listItemCSS}
`;

const StyledButton = styled(Button)`
  ${listItemCSS}
`;

const MenuItem = ({ href, iconName, children, onClick }) => {
  const Component = href ? StyledLink : StyledButton;

  return (
    <ListItem>
      <Component
        variant="unstyled"
        padding={2}
        href={href}
        onClick={onClick}
        spacing={3}
      >
        <Icon name={iconName} />
        <Box as="span">{children}</Box>
      </Component>
    </ListItem>
  );
};

MenuItem.propTypes = {
  href: PropTypes.string,
  iconName: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

const Menu = ({ items = [], title, ...props }) => {
  const Content = (contentProps) => (
    <List {...contentProps}>
      {items.map((menuItem, index) => (
        <MenuItem key={index} {...menuItem} />
      ))}
    </List>
  );

  if (!title) return <Content {...props} />;

  return (
    <Stack {...props}>
      <Title
        size={2}
        css={`
          font-size: 13px;
          font-weight: 400;
          text-transform: uppercase;
          opacity: 0.5;
        `}
      >
        {title}
      </Title>
      <Content />
    </Stack>
  );
};

Menu.propTypes = {
  items: PropTypes.array,
  title: PropTypes.string,
};

const SideBar = () => {
  const { t } = useTranslation();
  const [isJobLoggerVisible, setJobLoggerVisibility] = useState(false);

  const userMenu = [
    {
      href: '/dashboard',
      iconName: Icons.HOME,
      children: t('menu.home'),
    },
    {
      href: '/event',
      iconName: Icons.PLUS_CIRCLE,
      children: t('menu.add'),
    },
    {
      href: '/search',
      iconName: Icons.SEARCH,
      children: t('menu.search'),
    },
  ];

  const manageMenu = [
    {
      href: '/manage/moderation/overview',
      iconName: Icons.FLAG,
      children: t('menu.validate'),
    },
    {
      href: '/manage/users/overview',
      iconName: Icons.USER,
      children: t('menu.users'),
    },
    {
      href: '/manage/roles/overview',
      iconName: Icons.USERS,
      children: t('menu.roles'),
    },
    {
      href: '/manage/labels/overview',
      iconName: Icons.TAG,
      children: t('menu.labels'),
    },
    {
      href: '/manage/organizations',
      iconName: Icons.SLIDE_SHARE,
      children: t('menu.organizations'),
    },
    {
      href: '/manage/productions',
      iconName: Icons.LAYER_GROUP,
      children: t('menu.productions'),
    },
  ];

  const notificationMenu = [
    {
      iconName: Icons.GIFT,
      children: t('menu.announcements'),
      onClick: () => {},
    },
    {
      iconName: Icons.BELL,
      children: t('menu.notifications'),
      onClick: () => {
        setJobLoggerVisibility(!isJobLoggerVisible);
      },
    },
  ];

  return (
    <Inline>
      <Stack
        css={`
          width: 230px;
          background-color: ${getValueForSideBar('backgroundColor')};
          height: 100vh;
          color: ${getValueForSideBar('color')};
          z-index: 2000;
        `}
        padding={2}
      >
        <Link href="/dashboard">
          <Logo />
          {/* <Logo variants={LogoVariants.MOBILE} /> */}
        </Link>
        <Stack
          spacing={4}
          css={`
            flex: 1;
            > :not(:first-child) {
              border-top: 1px solid ${getValueForMenu('borderColor')};
            }
          `}
        >
          <Menu items={userMenu} />
          <Stack justifyContent="space-between" css="flex: 1;">
            <Menu items={manageMenu} title={t('menu.management')} />
            <Menu items={notificationMenu} />
          </Stack>
        </Stack>
      </Stack>
      {isJobLoggerVisible && (
        <JobLogger
          onClose={() => {
            setJobLoggerVisibility(!isJobLoggerVisible);
          }}
        />
      )}
    </Inline>
  );
};

export { SideBar };
