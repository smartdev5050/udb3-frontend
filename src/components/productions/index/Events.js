import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { List } from '../../publiq-ui/List';
import { getStackProps, Stack, stackPropTypes } from '../../publiq-ui/Stack';
import { Title } from '../../publiq-ui/Title';
import { Spinner } from '../../publiq-ui/Spinner';

const Events = ({
  events,
  activeProductionName,
  loading,
  className,
  ...props
}) => {
  const { t } = useTranslation();

  if (loading) return <Spinner />;

  return (
    <Stack {...getStackProps(props)}>
      <Title>
        {t('productions.overview.events_in_production', {
          productionName: activeProductionName,
        })}
      </Title>
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
  activeProductionName: PropTypes.string,
  className: PropTypes.string,
};

Events.defaultProps = {
  events: [],
};

export { Events };
