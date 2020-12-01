import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

import { Stack } from './publiq-ui/Stack';
import { Link } from './publiq-ui/Link';
import { List } from './publiq-ui/List';
import { useTranslation } from 'react-i18next';
import { Icons } from './publiq-ui/Icon';
import { getValueFromTheme } from './publiq-ui/theme';
import { Title } from './publiq-ui/Title';
import { Button } from './publiq-ui/Button';
import { Logo } from './publiq-ui/Logo';
import { Badge } from './publiq-ui/Badge';
import { Inline } from './publiq-ui/Inline';

import { JobLogger, JobLoggerStates } from './job/JobLogger';
import { Announcements, AnnouncementStatus } from './Annoucements';
import { useGetAnnouncements } from '../hooks/api/announcements';
import { Image } from './publiq-ui/Image';
import { Box } from './publiq-ui/Box';
import { useCookiesWithOptions } from '../hooks/useCookiesWithOptions';
import { useRouter } from 'next/router';
import { useGetPermissions, useGetRoles } from '../hooks/api/user';
import { useGetEventsToModerate } from '../hooks/api/events';
import { JobStatusIcon } from './job/JobStatusIcon';

const getValueForMenuItem = getValueFromTheme('menuItem');
const getValueForSideBar = getValueFromTheme('sideBar');
const getValueForMenu = getValueFromTheme('menu');

const MenuItem = ({ href, iconName, suffix, children, onClick }) => {
  const Component = href ? Link : Button;

  return (
    <List.Item>
      <Component
        width="100%"
        variant="unstyled"
        padding={2}
        href={href}
        iconName={iconName}
        suffix={suffix}
        onClick={onClick}
        backgroundColor={{
          default: 'none',
          hover: getValueForMenuItem('hover.backgroundColor'),
        }}
        spacing={3}
        textAlign="left"
      >
        {children}
      </Component>
    </List.Item>
  );
};

MenuItem.propTypes = {
  href: PropTypes.string,
  iconName: PropTypes.string,
  suffix: PropTypes.node,
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
    <Stack spacing={3} {...props}>
      <Title
        size={2}
        opacity={0.5}
        css={`
          font-size: 13px;
          font-weight: 400;
          text-transform: uppercase;
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

const ProfileMenu = ({ profileImage }) => {
  const { t } = useTranslation();
  const [, , removeCookie] = useCookiesWithOptions();
  const router = useRouter();

  const loginMenu = [
    {
      iconName: Icons.SIGN_OUT_ALT,
      children: t('menu.logout'),
      onClick: () => {
        removeCookie('token');
        removeCookie('user');

        const getBaseUrl = () =>
          `${window.location.protocol}//${window.location.host}`;

        const queryString = new URLSearchParams({
          destination: getBaseUrl(),
        }).toString();

        router.push(
          `${process.env.NEXT_PUBLIC_AUTH_URL}/logout?${queryString}`,
        );
      },
    },
  ];

  return (
    <Inline
      padding={1}
      spacing={2}
      alignItems="center"
      css={`
        border-top: 1px solid ${getValueForMenu('borderColor')};
      `}
    >
      <Image src={profileImage} width={50} height={50} alt="Profile picture" />
      <Stack as="div" padding={2} spacing={2} flex={1}>
        <Box as="span">username</Box>
        <Menu items={loginMenu} />
      </Stack>
    </Inline>
  );
};

ProfileMenu.propTypes = {
  profileImage: PropTypes.string,
};

ProfileMenu.defaultProps = {
  profileImage: '/assets/avatar.svg',
};

const PermissionTypes = {
  AANBOD_BEWERKEN: 'AANBOD_BEWERKEN',
  AANBOD_MODEREREN: 'AANBOD_MODEREREN',
  AANBOD_VERWIJDEREN: 'AANBOD_VERWIJDEREN',
  ORGANISATIES_BEWERKEN: 'ORGANISATIES_BEWERKEN',
  ORGANISATIES_BEHEREN: 'ORGANISATIES_BEHEREN',
  GEBRUIKERS_BEHEREN: 'GEBRUIKERS_BEHEREN',
  LABELS_BEHEREN: 'LABELS_BEHEREN',
  VOORZIENINGEN_BEWERKEN: 'VOORZIENINGEN_BEWERKEN',
  PRODUCTIES_AANMAKEN: 'PRODUCTIES_AANMAKEN',
};

const SideBar = () => {
  const { t } = useTranslation();

  const [cookies, setCookie] = useCookiesWithOptions([
    'seenAnnouncements',
    'userPicture',
  ]);

  const [isJobLoggerVisible, setIsJobLoggerVisible] = useState(true);
  const [jobLoggerStatus, setJobLoggerStatus] = useState(JobLoggerStates.IDLE);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAnnouncementId, setActiveAnnouncementId] = useState();

  const { data: dataWithAnnouncements = {} } = useGetAnnouncements({
    refetchInterval: 60000,
  });
  const rawAnnouncements = dataWithAnnouncements?.data ?? [];
  const { data: permissions = [] } = useGetPermissions();
  const { data: roles = [] } = useGetRoles();
  const { data: eventsToModerate = {} } = useGetEventsToModerate(searchQuery);
  const countEventsToModerate = eventsToModerate?.totalItems || 0;

  const handleClickAnnouncement = (activeAnnouncement) =>
    setActiveAnnouncementId(activeAnnouncement.uid);

  const toggleIsModalVisibile = () =>
    setIsModalVisible((isModalVisible) => !isModalVisible);

  useEffect(() => {
    if (isModalVisible) {
      setActiveAnnouncementId(announcements[0].uid);
    }
  }, [isModalVisible]);

  useEffect(() => {
    if (activeAnnouncementId) {
      const seenAnnouncements = cookies?.seenAnnouncements ?? [];
      if (!seenAnnouncements.includes(activeAnnouncementId)) {
        setCookie('seenAnnouncements', [
          ...seenAnnouncements,
          activeAnnouncementId,
        ]);
      }
    }
  }, [activeAnnouncementId]);

  useEffect(() => {
    if (rawAnnouncements.length === 0) {
      return;
    }

    const seenAnnouncements = cookies?.seenAnnouncements ?? [];
    const cleanedUpSeenAnnouncements = seenAnnouncements.filter(
      (seenAnnouncementId) =>
        rawAnnouncements.find(
          (announcement) => announcement.uid === seenAnnouncementId,
        ),
    );
    setCookie('seenAnnouncements', cleanedUpSeenAnnouncements);
  }, [rawAnnouncements]);

  useEffect(() => {
    if (roles.length === 0) {
      return;
    }

    const validationQuery = roles
      .map((role) =>
        role.constraints !== undefined && role.constraints.v3
          ? role.constraints.v3
          : null,
      )
      .filter((constraint) => constraint !== null)
      .join(' OR ');

    setSearchQuery(validationQuery);
  }, [roles]);

  const announcements = useMemo(
    () =>
      rawAnnouncements.map((announcement) => {
        if (activeAnnouncementId === announcement.uid) {
          return { ...announcement, status: AnnouncementStatus.ACTIVE };
        }
        const seenAnnouncements = cookies?.seenAnnouncements ?? [];
        if (seenAnnouncements.includes(announcement.uid)) {
          return { ...announcement, status: AnnouncementStatus.SEEN };
        }
        return { ...announcement, status: AnnouncementStatus.UNSEEN };
      }),
    [rawAnnouncements, cookies.seenAnnouncements, activeAnnouncementId],
  );

  const countUnseenAnnouncements = useMemo(
    () =>
      announcements.filter(
        (announcement) => announcement.status === AnnouncementStatus.UNSEEN,
      ).length,
    [announcements],
  );

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
      permission: PermissionTypes.AANBOD_MODEREREN,
      href: '/manage/moderation/overview',
      iconName: Icons.FLAG,
      children: t('menu.validate'),
      suffix: countEventsToModerate > 0 && (
        <Badge>{countEventsToModerate}</Badge>
      ),
    },
    {
      permission: PermissionTypes.GEBRUIKERS_BEHEREN,
      href: '/manage/users/overview',
      iconName: Icons.USER,
      children: t('menu.users'),
    },
    {
      permission: PermissionTypes.GEBRUIKERS_BEHEREN,
      href: '/manage/roles/overview',
      iconName: Icons.USERS,
      children: t('menu.roles'),
    },
    {
      permission: PermissionTypes.LABELS_BEHEREN,
      href: '/manage/labels/overview',
      iconName: Icons.TAG,
      children: t('menu.labels'),
    },
    {
      permission: PermissionTypes.ORGANISATIES_BEHEREN,
      href: '/manage/organizations',
      iconName: Icons.SLIDE_SHARE,
      children: t('menu.organizations'),
    },
    {
      permission: PermissionTypes.PRODUCTIES_AANMAKEN,
      href: '/manage/productions',
      iconName: Icons.LAYER_GROUP,
      children: t('menu.productions'),
    },
  ];

  const filteredManageMenu = useMemo(() => {
    if (permissions.length === 0) {
      return manageMenu;
    }

    return manageMenu.filter((menuItem) =>
      permissions.includes(menuItem.permission),
    );
  }, [permissions]);

  const notificationMenu = [
    {
      iconName: Icons.GIFT,
      children: t('menu.announcements'),
      suffix: countUnseenAnnouncements > 0 && (
        <Badge>{countUnseenAnnouncements}</Badge>
      ),
      onClick: () => toggleIsModalVisibile(),
    },
    {
      iconName: Icons.BELL,
      children: t('menu.notifications'),
      suffix: jobLoggerStatus && <JobStatusIcon status={jobLoggerStatus} />,
      onClick: () => {
        setIsJobLoggerVisible(!isJobLoggerVisible);
      },
    },
  ];

  return (
    <>
      <Inline>
        <Stack
          height="100vh"
          backgroundColor={getValueForSideBar('backgroundColor')}
          color={getValueForSideBar('color')}
          zIndex={1998}
          padding={2}
          spacing={3}
        >
          <Link href="/dashboard">
            <Inline justifyContent="center">
              <Logo />
              {/* <Logo variants={LogoVariants.MOBILE} /> */}
            </Inline>
          </Link>
          <Stack
            paddingTop={4}
            spacing={4}
            flex={1}
            css={`
              > :not(:first-child) {
                border-top: 1px solid ${getValueForMenu('borderColor')};
              }
            `}
          >
            <Menu items={userMenu} />
            <Stack justifyContent="space-between" flex={1}>
              <Menu items={filteredManageMenu} title={t('menu.management')} />
              <Stack>
                <Menu items={notificationMenu} />
                <ProfileMenu />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Inline>
      {isJobLoggerVisible && (
        <JobLogger
          onClose={() => setJobLoggerVisibility(!isJobLoggerVisible)}
        />
      )}
      <Announcements
        visible={isModalVisible}
        announcements={announcements || []}
        onClickAnnouncement={handleClickAnnouncement}
        onClose={toggleIsModalVisibile}
      />
    </>
  );
};

export { SideBar };
