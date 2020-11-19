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
import { Badge } from './publiq-ui/Badge';
import styled, { css } from 'styled-components';
import { useEffect, useState } from 'react';
import { AnnouncementsModal } from './AnnouncementsModal';
import { Inline } from './publiq-ui/Inline';

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
        <Box as="div" css="text-align: left; width: 100%;">
          {children}
        </Box>
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

const fetchAnnouncements = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_NEW_ANNOUNCEMENTS_URL);
  const { data } = await res.json();
  return data;
};

const SideBar = () => {
  const { t } = useTranslation();
  const [isModalVisible, setModalVisibility] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [seenAnnouncements, setSeenAnnouncements] = useState([]);
  const [countUnseenAnnouncements, setCountUnseenAnnouncements] = useState(0);

  useEffect(async () => {
    const newAnnouncements = await fetchAnnouncements();
    setAnnouncements(newAnnouncements);
  }, []);

  useEffect(() => {
    if (announcements.length === 0) return;
    setCountUnseenAnnouncements(
      announcements.length - seenAnnouncements.length,
    );
  }, [announcements, seenAnnouncements]);

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
      children: (
        <Inline
          forwardedAs="div"
          css="width: 100%;"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box as="span">{t('menu.announcements')}</Box>
          {countUnseenAnnouncements > 0 && (
            <Badge>{countUnseenAnnouncements}</Badge>
          )}
        </Inline>
      ),
      onClick: () => {
        setModalVisibility(true);
      },
    },
    {
      iconName: Icons.BELL,
      children: t('menu.notifications'),
      onClick: () => {},
    },
  ];

  return (
    <>
      <Stack
        css={`
          width: 230px;
          background-color: ${getValueForSideBar('backgroundColor')};
          height: 100vh;
          color: ${getValueForSideBar('color')};
          z-index: 1998;
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
      <AnnouncementsModal
        visible={isModalVisible}
        announcements={announcements}
        seenAnnouncements={seenAnnouncements}
        setSeenAnnouncements={setSeenAnnouncements}
        onClose={() => {
          setModalVisibility(false);
        }}
      />
    </>
  );
};

export { SideBar };
