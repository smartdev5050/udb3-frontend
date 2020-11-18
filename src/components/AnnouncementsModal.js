import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from './publiq-ui/Box';
import { Button } from './publiq-ui/Button';
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
  setSelectedAnnouncementId,
}) => {
  return (
    <ListItem
      padding={4}
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
  setSelectedAnnouncementId: PropTypes.func,
};

AnnouncementItem.defaultProps = {
  selected: false,
};

const AnnouncementsList = ({
  announcements,
  selectedAnnouncementId,
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
          setSelectedAnnouncementId={setSelectedAnnouncementId}
        />
      );
    })}
  </List>
);

AnnouncementsList.propTypes = {
  announcements: PropTypes.array,
  selectedAnnouncementId: PropTypes.string,
  setSelectedAnnouncementId: PropTypes.func,
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

const AnnouncementsModal = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(undefined);

  const fetchAnnouncements = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_NEW_ANNOUNCEMENTS_URL);
    const { data } = await res.json();
    return data;
  };

  useEffect(async () => {
    const newAnnouncements = await fetchAnnouncements();
    setAnnouncements(newAnnouncements);
  }, []);

  useEffect(() => {
    if (visible && announcements.length > 0) {
      setSelectedAnnouncementId(announcements[0].uid);
    }
  }, [visible]);

  useEffect(() => {
    const selectedAnnouncement = announcements.find(
      (announcement) => announcement.uid === selectedAnnouncementId,
    );
    setSelectedAnnouncement(selectedAnnouncement);
  }, [selectedAnnouncementId]);

  return (
    <ModalContent
      visible={visible}
      title={t('giftbox.new_features')}
      onClose={onClose}
    >
      {announcements.length > 0 ? (
        <Inline>
          <AnnouncementsList
            announcements={announcements}
            selectedAnnouncementId={selectedAnnouncementId}
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
          {t('giftbox.no_features')}
        </Box>
      )}
    </ModalContent>
  );
};

AnnouncementsModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

AnnouncementsModal.defaultProps = {
  visible: false,
  onClose: () => {},
};

export { AnnouncementsModal };
