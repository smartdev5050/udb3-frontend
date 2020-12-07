import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { List } from '../../publiq-ui/List';
import { getStackProps, Stack, stackPropTypes } from '../../publiq-ui/Stack';
import { Title } from '../../publiq-ui/Title';

const Events = ({ events, className, ...props }) => {
  const { t } = useTranslation();

  return (
    <Stack {...getStackProps(props)}>
      <Title>{t('productions.overview.events')}</Title>
      <List>
        {events.map((event, index) => (
          <List.Item
            key={index}
            paddingLeft={4}
            paddingRight={4}
            paddingBottom={3}
            paddingTop={3}
          >
            {event.name}
          </List.Item>
        ))}
      </List>
    </Stack>
  );
};

Events.propTypes = {
  ...stackPropTypes,
  events: PropTypes.array,
  className: PropTypes.string,
};

Events.defaultProps = {
  events: [],
};

export { Events };
