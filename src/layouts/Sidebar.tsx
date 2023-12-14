import Hotjar from '@hotjar/browser';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import type { ChangeEvent, ReactNode } from 'react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

import { useAnnouncementModalContext } from '@/context/AnnouncementModalContext';
import { useGetAnnouncementsQuery } from '@/hooks/api/announcements';
import { useGetEventsToModerateQuery } from '@/hooks/api/events';
import {
  useGetPermissionsQuery,
  useGetRolesQuery,
  useGetUserQuery,
  User,
} from '@/hooks/api/user';
import { useCookiesWithOptions } from '@/hooks/useCookiesWithOptions';
import { FeatureFlags, useFeatureFlag } from '@/hooks/useFeatureFlag';
import {
  useHandleWindowMessage,
  WindowMessageTypes,
} from '@/hooks/useHandleWindowMessage';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useMatchBreakpoint } from '@/hooks/useMatchBreakpoint';
import { QuestionCircleIcon } from '@/pages/NewFeatureTooltip';
import type { Values } from '@/types/Values';
import { Badge, BadgeVariants } from '@/ui/Badge';
import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Icon, Icons } from '@/ui/Icon';
import { Image } from '@/ui/Image';
import { getInlineProps, Inline, InlineProps } from '@/ui/Inline';
import { LabelPositions, LabelVariants } from '@/ui/Label';
import { Link } from '@/ui/Link';
import type { ListProps } from '@/ui/List';
import { List } from '@/ui/List';
import { Logo, LogoVariants } from '@/ui/Logo';
import { RadioButton, RadioButtonTypes } from '@/ui/RadioButton';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import {
  Breakpoints,
  colors,
  getGlobalBorderRadius,
  getValueFromTheme,
} from '@/ui/theme';
import { Title } from '@/ui/Title';

import { Announcements, AnnouncementStatus } from './Announcements';
import { JobLogger, JobLoggerStates } from './joblogger/JobLogger';
import { JobLoggerStateIndicator } from './joblogger/JobLoggerStateIndicator';

const { publicRuntimeConfig } = getConfig();

const shouldShowBetaVersion =
  publicRuntimeConfig.shouldShowBetaVersion === 'true';

const getValueForMenuItem = getValueFromTheme('menuItem');
const getValueForSidebar = getValueFromTheme('sidebar');
const getValueForMenu = getValueFromTheme('menu');

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
  FILMS_AANMAKEN: 'FILMS_AANMAKEN',
} as const;

type MenuItemType = {
  href?: string;
  iconName: Values<typeof Icons>;
  suffix?: ReactNode;
  children: string;
  onClick?: () => void;
  visible?: boolean;
  permission?: Values<typeof PermissionTypes>;
};

type MenuItemProps = Omit<MenuItemType, 'permission'>;

const MenuItem = memo(
  ({
    href,
    iconName,
    suffix,
    children: label,
    onClick,
    visible = true,
  }: MenuItemProps) => {
    const { asPath } = useRouter();

    const baseUrl = publicRuntimeConfig.baseUrl;
    const currentPath = new URL(asPath, baseUrl).pathname;
    const path = new URL(href, baseUrl).pathname;

    const isActive = path === currentPath;

    if (!visible) {
      return null;
    }

    const Component = href ? Link : Button;

    return (
      <List.Item
        css={`
          position: relative;

          color: ${isActive ? getValueForMenuItem('active.color') : 'inherit'};

          :before {
            content: '';
            width: 4px;
            background-color: ${isActive
              ? getValueForMenuItem('active.color')
              : 'inherit'};
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            border-radius: 4px;
          }

          :hover {
            color: ${getValueForMenuItem('hover.color')};

            :before {
              background-color: ${getValueForMenuItem('active.color')};
            }
          }
        `}
      >
        <Component
          width="100%"
          variant="unstyled"
          href={href}
          iconName={iconName}
          suffix={suffix}
          onClick={onClick}
          backgroundColor={{
            default: isActive
              ? getValueForMenuItem('active.backgroundColor')
              : 'none',
            hover: getValueForMenuItem('hover.backgroundColor'),
          }}
          spacing={{ default: 4, s: 1 }}
          stackOn={Breakpoints.S}
          customChildren
          title={label}
          paddingLeft={{ default: 4, s: 1 }}
          paddingBottom={{ default: 3, s: 2 }}
          paddingTop={{ default: 3, s: 2 }}
          paddingRight={{ default: 3, s: 1 }}
          borderRadius={getGlobalBorderRadius}
        >
          {label && (
            <Text
              flex={1}
              css={`
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              `}
              fontSize={{ default: '0.975rem', s: '0.625rem' }}
              textAlign={{ default: 'left', s: 'center' }}
            >
              {label}
            </Text>
          )}
        </Component>
      </List.Item>
    );
  },
);

MenuItem.displayName = 'MenuItem';

type MenuProps = ListProps & {
  items: MenuItemType[];
  title?: string;
};

const Menu = memo(({ items = [], title, ...props }: MenuProps) => {
  const Content = (contentProps) => (
    <List {...contentProps}>
      {items.map((menuItem, index) => (
        <MenuItem key={index} {...menuItem} />
      ))}
    </List>
  );

  Menu.displayName = 'Menu';

  if (!title) return <Content {...props} />;

  return (
    <Stack spacing={3} {...props}>
      <Title
        opacity={0.5}
        css={`
          font-size: 0.625rem;
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

type ProfileMenuProps = {
  defaultProfileImageUrl?: string;
};

const ProfileMenu = ({ defaultProfileImageUrl }: ProfileMenuProps) => {
  const getUserQuery = useGetUserQuery();
  // @ts-expect-error
  const user = getUserQuery.data as User;

  return (
    <Inline
      padding={3}
      spacing={2}
      marginTop={3}
      alignItems="center"
      justifyContent="center"
      css={`
        border-top: 0.5px solid ${getValueForMenu('borderColor')};
      `}
    >
      <Image
        src={user?.picture || defaultProfileImageUrl}
        width={40}
        height={40}
        borderRadius="50%"
        alt="Profile picture"
      />
      <Stack as="div" padding={2} spacing={2} flex={1} display={{ s: 'none' }}>
        {user && (
          <Stack>
            <Text>{user['https://publiq.be/first_name']}</Text>
            <Text fontSize="0.625rem">{user.email}</Text>
          </Stack>
        )}
      </Stack>
    </Inline>
  );
};

ProfileMenu.defaultProps = {
  defaultProfileImageUrl: '/assets/avatar.svg',
};

type NotificationMenuProps = {
  countUnseenAnnouncements: number;
  onClickAnnouncementsButton: () => void;
  onClickJobLoggerButton: () => void;
  jobLoggerState: Values<typeof JobLoggerStates>;
};

const NotificationMenu = memo(
  ({
    countUnseenAnnouncements,
    onClickAnnouncementsButton,
    onClickJobLoggerButton,
    jobLoggerState,
  }: NotificationMenuProps) => {
    const { t, i18n } = useTranslation();

    const { removeAuthenticationCookies } = useCookiesWithOptions();
    const queryClient = useQueryClient();
    const router = useRouter();

    const notificationMenu = [
      {
        iconName: Icons.GIFT,
        children: t('menu.announcements'),
        suffix: countUnseenAnnouncements > 0 && (
          <Badge variant={BadgeVariants.INFO}>{countUnseenAnnouncements}</Badge>
        ),
        onClick: onClickAnnouncementsButton,
        visible: i18n.language === 'nl',
      },
      {
        iconName: Icons.BELL,
        children: t('menu.notifications'),
        suffix: <JobLoggerStateIndicator state={jobLoggerState} />,
        onClick: onClickJobLoggerButton,
      },
      {
        iconName: Icons.SIGN_OUT,
        children: t('menu.logout'),
        onClick: async () => {
          removeAuthenticationCookies();
          await queryClient.invalidateQueries('user');

          window.location.assign('/api/auth/logout');
        },
      },
    ];

    return <Menu items={notificationMenu} />;
  },
);

NotificationMenu.displayName = 'NotificationMenu';

type BetaVersionToggleProps = Omit<InlineProps, 'onChange'> & {
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const BetaVersionToggle = ({
  checked,
  onChange,
  ...props
}: BetaVersionToggleProps) => {
  const { t } = useTranslation();

  return (
    <FormElement
      id="beta-version-switch"
      label={t('menu.beta_version')}
      labelVariant={LabelVariants.NORMAL}
      labelPosition={LabelPositions.LEFT}
      css={`
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        label {
          height: initial;
        }
      `}
      fontSize={{ s: '9px' }}
      spacing={{ default: 3, s: 1 }}
      stackOn={Breakpoints.S}
      Component={
        <RadioButton
          type={RadioButtonTypes.SWITCH}
          checked={checked}
          onChange={onChange}
          {...getInlineProps(props)}
        />
      }
    />
  );
};

const Sidebar = () => {
  const { t, i18n } = useTranslation();

  const queryClient = useQueryClient();
  const storage = useLocalStorage();

  const router = useRouter();

  const [isJobLoggerVisible, setIsJobLoggerVisible] = useState(true);
  const [jobLoggerState, setJobLoggerState] = useState(JobLoggerStates.IDLE);

  const [isNewCreateEnabled, setIsNewCreateEnabled] = useFeatureFlag(
    FeatureFlags.REACT_CREATE,
  );

  const sidebarComponent = useRef();

  const [announcementModalContext, setAnnouncementModalContext] =
    useAnnouncementModalContext();

  const [activeAnnouncementId, setActiveAnnouncementId] = useState();

  const [searchQuery, setSearchQuery] = useState('');

  const getAnnouncementsQuery = useGetAnnouncementsQuery({
    refetchInterval: 60000,
  });

  const rawAnnouncements = getAnnouncementsQuery.data?.data ?? [];
  const getPermissionsQuery = useGetPermissionsQuery();
  const getRolesQuery = useGetRolesQuery();
  const getEventsToModerateQuery = useGetEventsToModerateQuery(searchQuery);
  // @ts-expect-error
  const countEventsToModerate = getEventsToModerateQuery.data?.totalItems || 0;

  const isSmallView = useMatchBreakpoint(Breakpoints.S);

  const handleClickAnnouncement = useCallback(
    (activeAnnouncement) => setActiveAnnouncementId(activeAnnouncement.uid),
    [],
  );

  const toggleIsAnnouncementsModalVisible = useCallback(
    () =>
      setAnnouncementModalContext((prevModalContext) => ({
        ...prevModalContext,
        visible: !prevModalContext.visible,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const toggleIsJobLoggerVisible = useCallback(
    () => setIsJobLoggerVisible((prevValue) => !prevValue),
    [],
  );

  useEffect(() => {
    if (!router.query.hj) return;

    if (typeof window === 'undefined') return;

    const hotjarEvent = Array.isArray(router.query.hj)
      ? router.query.hj[0]
      : router.query.hj;

    // @ts-expect-error
    window.hj('trigger', hotjarEvent);
  }, [router]);

  useEffect(() => {
    if (announcementModalContext.visible) {
      setActiveAnnouncementId(
        announcementModalContext.visibleAnnouncementUid ?? announcements[0].uid,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [announcementModalContext.visible]);

  useEffect(() => {
    if (activeAnnouncementId) {
      const seenAnnouncements = storage.getItem('seenAnnouncements') ?? [];
      if (!seenAnnouncements.includes(activeAnnouncementId)) {
        storage.setItem('seenAnnouncements', [
          ...seenAnnouncements,
          activeAnnouncementId,
        ]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAnnouncementId]);

  useEffect(() => {
    if (rawAnnouncements.length === 0) {
      return;
    }

    const seenAnnouncements = storage.getItem('seenAnnouncements') ?? [];
    const cleanedUpSeenAnnouncements = seenAnnouncements.filter(
      (seenAnnouncementId) =>
        rawAnnouncements.find(
          (announcement) => announcement.uid === seenAnnouncementId,
        ),
    );
    storage.setItem('seenAnnouncements', cleanedUpSeenAnnouncements);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawAnnouncements]);

  useEffect(() => {
    // @ts-expect-error
    if (!getRolesQuery.data) {
      return;
    }

    // @ts-expect-error
    const validationQuery = getRolesQuery.data
      .map((role) => (role.constraints?.v3 ? role.constraints.v3 : null))
      .filter((constraint) => constraint !== null)
      .join(' OR ');

    setSearchQuery(validationQuery);
    // @ts-expect-error
  }, [getRolesQuery.data]);

  useHandleWindowMessage({
    [WindowMessageTypes.OFFER_MODERATED]: () =>
      queryClient.invalidateQueries(['events']),
  });

  const announcements = useMemo(
    () =>
      rawAnnouncements.map((announcement) => {
        if (activeAnnouncementId === announcement.uid) {
          return { ...announcement, status: AnnouncementStatus.ACTIVE };
        }
        const seenAnnouncements = storage.getItem('seenAnnouncements') ?? [];
        if (seenAnnouncements.includes(announcement.uid)) {
          return { ...announcement, status: AnnouncementStatus.SEEN };
        }
        return { ...announcement, status: AnnouncementStatus.UNSEEN };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rawAnnouncements, activeAnnouncementId],
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
      href: '/dashboard?tab=events&page=1&sort=created_desc',
      iconName: Icons.HOME,
      children: t('menu.home'),
    },
    {
      href: '/create',
      iconName: Icons.PLUS_CIRCLE,
      children: t('menu.add'),
    },
    {
      href: '/search',
      iconName: Icons.SEARCH,
      children: t('menu.search'),
    },
  ];

  const filteredManageMenu = useMemo(() => {
    // @ts-expect-error
    if (!getPermissionsQuery.data) {
      return [];
    }

    const manageMenu: MenuItemType[] = [
      {
        permission: PermissionTypes.AANBOD_MODEREREN,
        href: '/manage/moderation/overview',
        iconName: Icons.FLAG,
        children: t('menu.validate'),
        suffix: countEventsToModerate > 0 && (
          <Badge variant={BadgeVariants.INFO}>{countEventsToModerate}</Badge>
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
      {
        permission: PermissionTypes.FILMS_AANMAKEN,
        href: '/manage/movies/create',
        iconName: Icons.VIDEO,
        children: t('menu.movies'),
        visible: i18n.language === 'nl',
      },
    ];

    return manageMenu.filter((menuItem) => {
      // @ts-expect-error
      return getPermissionsQuery.data.includes(menuItem.permission);
    });
    // @ts-expect-error
  }, [countEventsToModerate, getPermissionsQuery.data, i18n.language, t]);

  return [
    <Stack
      key="sidebar"
      forwardedAs="nav"
      height="100%"
      css={`
        overflow: scroll;
      `}
      width={{ default: '240px', s: '65px' }}
      backgroundColor={getValueForSidebar('backgroundColor')}
      color={getValueForSidebar('color')}
      zIndex={getValueForSidebar('zIndex')}
      padding={{ default: 4.5, s: 1 }}
      spacing={3}
      ref={sidebarComponent}
      onMouseOver={() => {
        if (!sidebarComponent?.current) return;
        if (document.activeElement?.tagName?.toLowerCase() !== 'iframe') {
          return;
        }
        // @ts-expect-error
        document.activeElement.blur();
      }}
    >
      <Link
        justifyContent="center"
        href="/dashboard"
        title={t('menu.home')}
        customChildren
        paddingBottom={2}
      >
        <Logo
          variant={isSmallView ? LogoVariants.MOBILE : LogoVariants.DEFAULT}
          color={colors.udbMainBlue}
        />
      </Link>
      <Stack
        paddingTop={4}
        spacing={4}
        flex={1}
        css={`
          border-top: 0.5px solid ${getValueForMenu('borderColor')};
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
            <Inline
              display={shouldShowBetaVersion ? 'inherit' : 'none'}
              flex={1}
              paddingLeft={2}
              alignItems="center"
              justifyContent={{ default: 'space-between', s: 'center' }}
              stackOn={Breakpoints.S}
              padding={2}
              width="100%"
            >
              <Inline
                stackOn={Breakpoints.S}
                spacing={{ default: 4, s: 1 }}
                alignItems="center"
                justifyContent={{ default: 'center', s: 'center' }}
                width="100%"
              >
                <Icon name={Icons.EYE} />
                <BetaVersionToggle
                  checked={isNewCreateEnabled}
                  onChange={() => {
                    setIsNewCreateEnabled((prev) => !prev);
                  }}
                />
              </Inline>
            </Inline>
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
    </Stack>,
    <JobLogger
      key="joblogger"
      visible={isJobLoggerVisible}
      onClose={() => setIsJobLoggerVisible((oldState) => !oldState)}
      onStatusChange={setJobLoggerState}
    />,
    <Announcements
      key="announcements"
      visible={announcementModalContext.visible}
      announcements={announcements || []}
      onClickAnnouncement={handleClickAnnouncement}
      onClose={toggleIsAnnouncementsModalVisible}
    />,
  ];
};

export { PermissionTypes, Sidebar };
