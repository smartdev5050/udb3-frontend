import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Box, parseSpacing } from './publiq-ui/Box';
import { Button } from './publiq-ui/Button';
import { Icon, Icons } from './publiq-ui/Icon';
import { Image } from './publiq-ui/Image';
import { Inline } from './publiq-ui/Inline';
import { Link } from './publiq-ui/Link';
import { List } from './publiq-ui/List';
import { ListItem } from './publiq-ui/ListItem';
import { ModalContent } from './publiq-ui/ModalContent';
import { Stack } from './publiq-ui/Stack';
import { getValueFromTheme } from './publiq-ui/theme';
import { Title } from './publiq-ui/Title';

const AnnouncementStatus = {
  ACTIVE: 'active',
  SEEN: 'seen',
  UNSEEN: 'unseen',
};

const getValueForAnnouncement = getValueFromTheme('announcement');
const getValueForAnnouncementList = getValueFromTheme('announcementList');
const getValueForAnnouncementContent = getValueFromTheme('announcementContent');

const Announcement = ({ id, title, status, onClick }) => {
  return (
    <ListItem
      padding={4}
      spacing={3}
      css={`
        cursor: pointer;
        border-bottom: ${getValueForAnnouncement('borderColor')} 1px solid;
        background-color: ${status === AnnouncementStatus.ACTIVE
          ? getValueForAnnouncement('selected.backgroundColor')
          : 'inherit'};

        :hover {
          background-color: ${status === AnnouncementStatus.ACTIVE
            ? getValueForAnnouncement('selected.hoverBackgroundColor')
            : getValueForAnnouncement('hoverBackgroundColor')};
        }
      `}
      onClick={() => {
        onClick(id);
      }}
    >
      {status === AnnouncementStatus.UNSEEN ? (
        <Icon name={Icons.EYE} />
      ) : (
        <Icon name={Icons.EYE_SLASH} />
      )}
      <Box
        as="span"
        css={`
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        `}
      >
        {title}
      </Box>
    </ListItem>
  );
};

Announcement.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  status: PropTypes.oneOf(Object.values(AnnouncementStatus)),
  onClick: PropTypes.func,
};

Announcement.defaultProps = {
  status: AnnouncementStatus.UNSEEN,
};

const AnnouncementContent = ({
  title,
  imageSrc,
  body,
  callToAction,
  callToActionLabel,
}) => (
  <Stack
    forwardedAs="article"
    padding={4}
    spacing={3}
    css={`
      width: 70%;
    `}
  >
    <Title>{title}</Title>
    {imageSrc && (
      <Link href={callToAction}>
        <Image
          src={imageSrc}
          alt={callToActionLabel}
          css={`
            width: 100%;
            max-height: 30vh;
            background-position: center center;
            background-repeat: no-repeat;
            object-fit: cover;

            &:hover {
              opacity: 0.85;
            }
          `}
        />
      </Link>
    )}

    <div
      dangerouslySetInnerHTML={{ __html: body }}
      css={`
        strong {
          font-weight: bold;
        }

        a {
          color: ${getValueForAnnouncementContent('linkColor')};
        }

        p {
          margin-bottom: ${parseSpacing(4)}rem;
        }

        ol {
          list-style-type: decimal;
          margin-bottom: ${parseSpacing(4)}rem;

          li {
            margin-left: ${parseSpacing(5)}rem;
          }
        }
        ul {
          list-style-type: disc;
          margin-bottom: ${parseSpacing(4)}rem;

          li {
            margin-left: ${parseSpacing(5)}rem;
          }
        }
      `}
    />
    <Inline as="div" justifyContent="flex-end">
      {callToAction && (
        <Link href={callToAction}>
          <Button>
            <Box as="span">{callToActionLabel}</Box>
          </Button>
        </Link>
      )}
    </Inline>
  </Stack>
);

AnnouncementContent.propTypes = {
  title: PropTypes.string,
  imageSrc: PropTypes.string,
  body: PropTypes.node,
  callToAction: PropTypes.string,
  callToActionLabel: PropTypes.string,
};

const Announcements = ({
  visible,
  announcements,
  onClickAnnouncement,
  onShow,
  onClose,
}) => {
  const { t } = useTranslation();

  const activeAnnouncement = announcements.find(
    (announcement) => announcement.status === AnnouncementStatus.ACTIVE,
  );

  return (
    <ModalContent
      visible={visible}
      title={t('announcements.new_features')}
      onShow={onShow}
      onClose={onClose}
    >
      {announcements.length > 0 ? (
        <Inline>
          <List
            css={`
              width: 30%;
              border-right: ${getValueForAnnouncementList('borderColor')} 1px
                solid;
              overflow-y: auto;
            `}
          >
            {announcements.map((announcement) => {
              return (
                <Announcement
                  key={announcement.uid}
                  id={announcement.uid}
                  title={announcement.title}
                  status={announcement.status}
                  onClick={() => {
                    onClickAnnouncement(announcement);
                  }}
                />
              );
            })}
          </List>
          {activeAnnouncement && (
            <AnnouncementContent
              key={activeAnnouncement.uid}
              title={activeAnnouncement.title}
              imageSrc={activeAnnouncement.image}
              body={activeAnnouncement.body}
              callToAction={activeAnnouncement.callToAction}
              callToActionLabel={activeAnnouncement.callToActionLabel}
            />
          )}
        </Inline>
      ) : (
        <Box as="p" padding={4}>
          {t('announcements.no_features')}
        </Box>
      )}
    </ModalContent>
  );
};

Announcements.propTypes = {
  visible: PropTypes.bool,
  announcements: PropTypes.array,
  onClickAnnouncement: PropTypes.func,
  onShow: PropTypes.func,
  onClose: PropTypes.func,
};

Announcements.defaultProps = {
  visible: false,
  setAnnouncements: () => {},
  onShow: () => {},
  onClose: () => {},
};

export { Announcements, AnnouncementStatus };
