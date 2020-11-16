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

const getValueForMenuItemLink = getValueFromTheme('menuItemLink');
const getValueForSideBar = getValueFromTheme('sideBar');
const getValueForMenu = getValueFromTheme('menu');

const MenuItem = ({ href, iconName, children }) => {
  return (
    <ListItem>
      <Link
        href={href}
        css={`
          display: flex;
          width: 100%;
          text-decoration: none;
          color: ${getValueForMenuItemLink('color')};
          padding: 4px;

          &:hover {
            color: ${getValueForMenuItemLink('hover.color')};
            background-color: ${getValueForMenuItemLink(
              'hover.backgroundColor',
            )};
            text-decoration: none;
          }
        `}
      >
        <Icon name={iconName} marginRight={3} />
        <Box as="span">{children}</Box>
      </Link>
    </ListItem>
  );
};

MenuItem.propTypes = {
  href: PropTypes.string,
  iconName: PropTypes.string,
  children: PropTypes.node,
};

const Menu = ({ items = [], title, ...props }) => {
  const Content = (contentProps) => (
    <List {...contentProps}>
      {items.map((menuItem) => (
        <MenuItem key={menuItem.href} {...menuItem} />
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

  return (
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
        <img
          src="/assets/udb-logo.svg"
          alt="Uitdatabank"
          className="udb-logo"
        />
        <img
          src="/assets/udb-logo-mobile.svg"
          alt="Uitdatabank"
          className="udb-logo-mobile"
          css="display: none;"
        />
      </Link>
      <Stack
        spacing={4}
        css={`
          > :not(:first-child) {
            border-top: 1px solid ${getValueForMenu('borderColor')};
          }
        `}
      >
        <Menu items={userMenu} />
        <Menu items={manageMenu} title={t('menu.management')} />
      </Stack>
    </Stack>
  );
};

export { SideBar };
