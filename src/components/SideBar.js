import PropTypes from 'prop-types';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { Stack } from './publiq-ui/Stack';
import { Link } from './publiq-ui/Link';
import { List } from './publiq-ui/List';
import { useTranslation } from 'react-i18next';
import { Icons } from './publiq-ui/Icon';
import { Breakpoints, getValueFromTheme } from './publiq-ui/theme';
import { Title } from './publiq-ui/Title';
import { Button } from './publiq-ui/Button';
import { Logo, LogoVariants } from './publiq-ui/Logo';
import { Badge } from './publiq-ui/Badge';
import { Inline } from './publiq-ui/Inline';

import { JobLogger, JobLoggerStates } from './joblogger/JobLogger';
import { Announcements, AnnouncementStatus } from './Annoucements';
import { useGetAnnouncements } from '../hooks/api/announcements';
import { Image } from './publiq-ui/Image';
import { useCookiesWithOptions } from '../hooks/useCookiesWithOptions';
import { useRouter } from 'next/router';
import { useGetPermissions, useGetRoles } from '../hooks/api/user';
import { useGetEventsToModerate } from '../hooks/api/events';
import { JobLoggerStateIndicator } from './joblogger/JobLoggerStateIndicator';
import { Text } from './publiq-ui/Text';
import { useMatchBreakpoint } from '../hooks/useMatchBreakpoint';

const getValueForMenuItem = getValueFromTheme('menuItem');
const getValueForSideBar = getValueFromTheme('sideBar');
const getValueForMenu = getValueFromTheme('menu');

const MenuItem = memo(
  ({ href, iconName, suffix, children: label, onClick }) => {
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
          spacing={{ default: 3, s: 0 }}
          stackOn={Breakpoints.S}
          customChildren
          title={label}
        >
          <Text
            flex={1}
            css={`
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            `}
            fontSize={{ s: '9px' }}
            textAlign={{ default: 'left', s: 'center' }}
          >
            {label}
          </Text>
        </Component>
      </List.Item>
    );
  },
);

MenuItem.propTypes = {
  href: PropTypes.string,
  iconName: PropTypes.string,
  suffix: PropTypes.node,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

const Menu = memo(({ items = [], title, ...props }) => {
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
        opacity={0.5}
        css={`
          font-size: 13px;
          font-weight: 400;
          text-transform: uppercase;
        `}
        textAlign={{ s: 'center' }}
      >
        {title}
      </Title>
      <Content />
    </Stack>
  );
});

Menu.propTypes = {
  items: PropTypes.array,
  title: PropTypes.string,
};

const ProfileMenu = ({ profileImage }) => {
  const { t } = useTranslation();
  const [cookies, , removeCookie] = useCookiesWithOptions(['user']);
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
      justifyContent="center"
      css={`
        border-top: 1px solid ${getValueForMenu('borderColor')};
      `}
    >
      <Image src={profileImage} width={50} height={50} alt="Profile picture" />
      <Stack as="div" padding={2} spacing={2} flex={1} display={{ s: 'none' }}>
        <Text>{cookies?.user?.username ?? ''}</Text>
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

const NotificationMenu = memo(
  ({
    countUnseenAnnouncements,
    onClickAnnouncementsButton,
    onClickJobLoggerButton,
    jobLoggerState,
  }) => {
    const { t } = useTranslation();

    const notificationMenu = [
      {
        iconName: Icons.GIFT,
        children: t('menu.announcements'),
        suffix: countUnseenAnnouncements > 0 && (
          <Badge>{countUnseenAnnouncements}</Badge>
        ),
        onClick: onClickAnnouncementsButton,
      },
      {
        iconName: Icons.BELL,
        children: t('menu.notifications'),
        suffix: <JobLoggerStateIndicator state={jobLoggerState} />,
        onClick: onClickJobLoggerButton,
      },
    ];

    return <Menu items={notificationMenu} />;
  },
);

NotificationMenu.propTypes = {
  countUnseenAnnouncements: PropTypes.number,
  onClickAnnouncementsButton: PropTypes.func,
  onClickJobLoggerButton: PropTypes.func,
  jobLoggerState: PropTypes.oneOf(Object.values(JobLoggerStates)),
};

const SideBar = () => {
  const { t } = useTranslation();

  const [cookies, setCookie] = useCookiesWithOptions([
    'seenAnnouncements',
    'userPicture',
  ]);

  const [isJobLoggerVisible, setIsJobLoggerVisible] = useState(true);
  const [jobLoggerState, setJobLoggerState] = useState(JobLoggerStates.IDLE);

  const [
    isAnnouncementsModalVisible,
    setIsAnnouncementsModalVisible,
  ] = useState(false);
  const [activeAnnouncementId, setActiveAnnouncementId] = useState();

  const [searchQuery, setSearchQuery] = useState('');

  const { data: dataWithAnnouncements = {} } = useGetAnnouncements({
    refetchInterval: 60000,
  });

  const rawAnnouncements = dataWithAnnouncements?.data ?? [];
  const { data: permissions = [] } = useGetPermissions();
  const { data: roles = [] } = useGetRoles();
  const { data: eventsToModerate = {} } = useGetEventsToModerate(searchQuery);
  const countEventsToModerate = eventsToModerate?.totalItems || 0;

  const isSmallView = useMatchBreakpoint(Breakpoints.S);

  const handleClickAnnouncement = useCallback(
    (activeAnnouncement) => setActiveAnnouncementId(activeAnnouncement.uid),
    [],
  );

  const toggleIsAnnouncementsModalVisible = useCallback(
    () => setIsAnnouncementsModalVisible((prevValue) => !prevValue),
    [],
  );

  const toggleIsJobLoggerVisible = useCallback(
    () => setIsJobLoggerVisible((prevValue) => !prevValue),
    [],
  );

  useEffect(() => {
    if (isAnnouncementsModalVisible) {
      setActiveAnnouncementId(announcements[0].uid);
    }
  }, [isAnnouncementsModalVisible]);

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
      return [];
    }

    return manageMenu.filter((menuItem) =>
      permissions.includes(menuItem.permission),
    );
  }, [permissions]);

  return (
    <>
      <Inline>
        <Stack
          height="100vh"
          width={{ default: '230px', s: '65px' }}
          backgroundColor={getValueForSideBar('backgroundColor')}
          color={getValueForSideBar('color')}
          zIndex={1998}
          padding={{ default: 2, s: 0 }}
          spacing={3}
        >
          <Link
            justifyContent="center"
            href="/dashboard"
            title={t('menu.home')}
            customChildren
          >
            <Logo
              variant={isSmallView ? LogoVariants.MOBILE : LogoVariants.DEFAULT}
            />
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
            <Stack
              justifyContent={
                filteredManageMenu.length > 0 ? 'space-between' : 'flex-end'
              }
              flex={1}
            >
              {filteredManageMenu.length > 0 && (
                <Menu items={filteredManageMenu} title={t('menu.management')} />
              )}
              <Stack>
                <NotificationMenu
                  countUnseenAnnouncements={countUnseenAnnouncements}
                  jobLoggerState={jobLoggerState}
                  onClickAnnouncementsButton={toggleIsAnnouncementsModalVisible}
                  onClickJobLoggerButton={toggleIsJobLoggerVisible}
                />
                <ProfileMenu />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Inline>
      <JobLogger
        visible={isJobLoggerVisible}
        onClose={() => setIsJobLoggerVisible((oldState) => !oldState)}
        onStatusChange={setJobLoggerState}
      />
      <Announcements
        visible={isAnnouncementsModalVisible}
        announcements={announcements || []}
        onClickAnnouncement={handleClickAnnouncement}
        onClose={toggleIsAnnouncementsModalVisible}
      />
    </>
  );
};

export { SideBar };
