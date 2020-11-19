import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import { Box } from './publiq-ui/Box';
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

const getValueForAnnouncementItem = getValueFromTheme('announcementItem');
const getValueForAnnouncementList = getValueFromTheme('announcementList');
const getValueForAnnouncementContent = getValueFromTheme('announcementContent');

const AnnouncementItem = ({
  id,
  title,
  selected,
  seen,
  setSelectedAnnouncementId,
}) => {
  return (
    <ListItem
      padding={4}
      spacing={3}
      css={`
        cursor: pointer;
        border-bottom: ${getValueForAnnouncementItem('borderColor')} 1px solid;
        background-color: ${selected
          ? getValueForAnnouncementItem('selected.backgroundColor')
          : 'inherit'};

        :hover {
          background-color: ${selected
            ? getValueForAnnouncementItem('selected.hoverBackgroundColor')
            : getValueForAnnouncementItem('hoverBackgroundColor')};
        }
      `}
      onClick={() => {
        setSelectedAnnouncementId(id);
      }}
    >
      {seen ? <Icon name={Icons.EYE_SLASH} /> : <Icon name={Icons.EYE} />}
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

AnnouncementItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  seen: PropTypes.bool,
  setSelectedAnnouncementId: PropTypes.func,
};

AnnouncementItem.defaultProps = {
  selected: false,
  seen: false,
};

const AnnouncementsList = ({
  announcements,
  selectedAnnouncementId,
  seenAnnouncements,
  setSelectedAnnouncementId,
}) => (
  <List
    css={`
      width: 30%;
      border-right: ${getValueForAnnouncementList('borderColor')} 1px solid;
      overflow-y: auto;
    `}
  >
    {announcements.map((announcement) => {
      return (
        <AnnouncementItem
          key={announcement.uid}
          id={announcement.uid}
          title={announcement.title}
          selected={announcement.uid === selectedAnnouncementId}
          seen={seenAnnouncements.includes(announcement.uid)}
          setSelectedAnnouncementId={setSelectedAnnouncementId}
        />
      );
    })}
  </List>
);

AnnouncementsList.propTypes = {
  announcements: PropTypes.array,
  selectedAnnouncementId: PropTypes.string,
  seenAnnouncements: PropTypes.array,
  setSelectedAnnouncementId: PropTypes.func,
};

AnnouncementsList.defaultProps = {
  seenAnnouncements: [],
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
          margin-bottom: 1rem;
        }
        ol {
          display: block;
          list-style-type: decimal;
          margin-block-start: 1em;
          margin-block-end: 1em;
          margin-inline-start: 0px;
          margin-inline-end: 0px;
          padding-inline-start: 40px;
        }
        ul {
          display: block;
          list-style-type: disc;
          margin-block-start: 1em;
          margin-block-end: 1em;
          margin-inline-start: 0px;
          margin-inline-end: 0px;
          padding-inline-start: 40px;
        }
      `}
    />
    <Inline as="div" justifyContent="flex-end">
      {callToAction && (
        <Link href={callToAction}>
          <Button>{callToActionLabel}</Button>
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

const AnnouncementsModal = ({
  visible,
  announcements,
  setAnnouncements,
  seenAnnouncements,
  setSeenAnnouncements,
  onClose,
}) => {
  const { t } = useTranslation();
  const cookieOptions = {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  };
  const [cookies, setCookie] = useCookies(['seenAnnouncements']);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(undefined);

  const addToSeenAnnouncements = (id) => {
    setSeenAnnouncements((prev) => (prev.length > 0 ? [...prev, id] : [id]));
    setCookie(
      'seenAnnouncements',
      cookies.seenAnnouncements
        ? [...cookies.seenAnnouncements, selectedAnnouncementId]
        : [selectedAnnouncementId],
      cookieOptions,
    );
  };

  useEffect(() => {
    if (cookies.seenAnnouncements) {
      const updatedSeenAnnouncements = cookies.seenAnnouncements.filter(
        (announcement) => !announcements.includes(announcement.uid),
      );
      setSeenAnnouncements(updatedSeenAnnouncements);
    }
  }, []);

  useEffect(() => {
    if (!visible || announcements.length === 0) return;
    setSelectedAnnouncementId(announcements[0].uid);
  }, [visible]);

  useEffect(() => {
    if (!selectedAnnouncementId) return;

    const selectedAnnouncement = announcements.find(
      (announcement) => announcement.uid === selectedAnnouncementId,
    );
    setSelectedAnnouncement(selectedAnnouncement);

    if (!seenAnnouncements.includes(selectedAnnouncementId)) {
      addToSeenAnnouncements(selectedAnnouncementId);
    }
  }, [selectedAnnouncementId]);

  return (
    <ModalContent
      visible={visible}
      title={t('announcements.new_features')}
      onClose={onClose}
    >
      {announcements.length > 0 ? (
        <Inline>
          <AnnouncementsList
            announcements={announcements}
            selectedAnnouncementId={selectedAnnouncementId}
            seenAnnouncements={seenAnnouncements}
            setSelectedAnnouncementId={setSelectedAnnouncementId}
          />
          {selectedAnnouncement && (
            <AnnouncementContent
              key={selectedAnnouncementId}
              title={selectedAnnouncement.title}
              imageSrc={selectedAnnouncement.image}
              body={selectedAnnouncement.body}
              callToAction={selectedAnnouncement.callToAction}
              callToActionLabel={selectedAnnouncement.callToActionLabel}
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

AnnouncementsModal.propTypes = {
  visible: PropTypes.bool,
  announcements: PropTypes.array,
  setAnnouncements: PropTypes.func,
  seenAnnouncements: PropTypes.array,
  setSeenAnnouncements: PropTypes.func,
  onClose: PropTypes.func,
};

AnnouncementsModal.defaultProps = {
  visible: false,
  setAnnouncements: () => {},
  setSeenAnnouncements: () => {},
  onClose: () => {},
};

export { AnnouncementsModal };
