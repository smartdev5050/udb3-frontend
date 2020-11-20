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
import { useEffect, useMemo, useState } from 'react';
import {
  AnnouncementItemStatus,
  AnnouncementsModal,
} from './AnnouncementsModal';
import { Inline } from './publiq-ui/Inline';
import { useCookies } from 'react-cookie';
import { useAnnouncements } from '../api';

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
        <Box css="text-align: left; width: 100%;">{children}</Box>
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const announcementsQuery = useAnnouncements();
  const { data, isSuccess } = announcementsQuery;
  const cookieOptions = {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'none',
    secure: true,
  };
  const [cookies, setCookie] = useCookies([
    { name: 'seenAnnouncements', options: cookieOptions },
  ]);

  const seenAnnouncementIds = useMemo(() => {
    return announcements
      .map((announcement) => {
        if (announcement.status !== AnnouncementItemStatus.UNSEEN) {
          return announcement.uid;
        }
      })
      .filter((announcementId) => announcementId !== undefined);
  }, [announcements]);

  const countUnseenAnnouncements =
    announcements.length - seenAnnouncementIds.length;

  const updateCookies = (fetchedAnnouncements) => {
    if (!cookies.seenAnnouncements) {
      setCookie('seenAnnouncements', []);
      return;
    }
    // filter only relevant cookies
    const updatedCookies = cookies.seenAnnouncements.filter(
      (seenAnnouncementId) => fetchedAnnouncements.includes(seenAnnouncementId),
    );
    setCookie('seenAnnouncements', updatedCookies);
  };

  const getAnnouncementsWithStatus = (fetchedAnnouncements) => {
    return fetchedAnnouncements.map((announcement) => {
      const isInCookies = cookies.seenAnnouncements
        ? cookies.seenAnnouncements.includes(announcement.uid)
        : false;
      announcement.status = isInCookies
        ? AnnouncementItemStatus.SEEN
        : AnnouncementItemStatus.UNSEEN;
      return announcement;
    });
  };

  const handleClickAnnouncement = (activeAnnouncement) => {
    const mappedAnnouncements = announcements.map((announcement) => {
      if (announcement.status === AnnouncementItemStatus.ACTIVE) {
        announcement.status = AnnouncementItemStatus.SEEN;
      }
      if (announcement.uid === activeAnnouncement.uid) {
        announcement.status = AnnouncementItemStatus.ACTIVE;
      }
      return announcement;
    });
    setAnnouncements(mappedAnnouncements);
  };

  const handleShowAnnouncementsModal = () => {
    const mappedAnnouncements = announcements.map((announcement, index) => {
      if (announcement.status === AnnouncementItemStatus.ACTIVE) {
        announcement.status = AnnouncementItemStatus.SEEN;
      }
      if (index === 0) {
        announcement.status = AnnouncementItemStatus.ACTIVE;
      }
      return announcement;
    });
    setAnnouncements(mappedAnnouncements);
  };

  const handleCloseAnnouncementModal = () => {
    setIsModalVisible(false);
  };

  useEffect(async () => {
    const fetchedAnnouncements = [];
    updateCookies(fetchedAnnouncements);
    const announcementsWithStatus = getAnnouncementsWithStatus(
      fetchedAnnouncements,
    );
    setAnnouncements(announcementsWithStatus);
  }, []);

  useEffect(() => {
    setCookie('seenAnnouncements', seenAnnouncementIds);
  }, [announcements]);

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
        setIsModalVisible(true);
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
        onClickAnnouncement={handleClickAnnouncement}
        onShow={handleShowAnnouncementsModal}
        onClose={handleCloseAnnouncementModal}
      />
    </>
  );
};

export { SideBar };
