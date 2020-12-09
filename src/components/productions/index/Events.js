import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { List } from '../../publiq-ui/List';
import { getStackProps, Stack, stackPropTypes } from '../../publiq-ui/Stack';
import { Title } from '../../publiq-ui/Title';
import { CheckboxWithLabel } from '../../publiq-ui/CheckboxWithLabel';
import { Button, ButtonVariants } from '../../publiq-ui/Button';
import { Icon, Icons } from '../../publiq-ui/Icon';
import { useState } from 'react';
import { getValueFromTheme } from '../../publiq-ui/theme';
import { Panel } from '../../publiq-ui/Panel';
import { Inline } from '../../publiq-ui/Inline';
import { Text } from '../../publiq-ui/Text';
import { useGetCalendarSummary } from '../../../hooks/api/events';
import { Spinner } from '../../publiq-ui/Spinner';

const getValue = getValueFromTheme('eventItem');

const getEventType = (terms) => {
  const foundTerm = terms.find((term) => term.domain === 'eventtype') || {};
  return foundTerm.label ? foundTerm.label : '';
};

const Event = ({ id, name, type, location, calendarType, className }) => {
  const { i18n } = useTranslation();
  const { data: period } = useGetCalendarSummary({
    id,
    locale: i18n?.language ?? '',
    format: calendarType === 'single' ? 'lg' : 'sm',
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleClickToggleExpand = () => {
    setIsExpanded((prevValue) => !prevValue);
  };

  return (
    <List.Item
      key={id}
      paddingLeft={4}
      paddingRight={4}
      paddingBottom={3}
      paddingTop={3}
      backgroundColor="white"
      className={className}
    >
      <Stack flex={1}>
        <Inline justifyContent="space-between">
          <CheckboxWithLabel id={id} name={name}>
            {name}
          </CheckboxWithLabel>
          <Button
            onClick={handleClickToggleExpand}
            variant={ButtonVariants.UNSTYLED}
          >
            <Icon
              name={isExpanded ? Icons.CHEVRON_DOWN : Icons.CHEVRON_RIGHT}
            />
          </Button>
        </Inline>
        {isExpanded && (
          <Stack>
            <Text>{`type: ${type}`}</Text>
            <Text>{`period: ${period}`}</Text>
            <Text>{`location: ${location}`}</Text>
          </Stack>
        )}
      </Stack>
    </List.Item>
  );
};

Event.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  location: PropTypes.string,
  calendarType: PropTypes.string,
  className: PropTypes.string,
};

const Events = ({
  events,
  activeProductionName,
  loading,
  className,
  ...props
}) => {
  const { t, i18n } = useTranslation();

  return (
    <Stack spacing={4} {...getStackProps(props)}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Title>
            {t('productions.overview.events_in_production', {
              productionName: activeProductionName,
            })}
          </Title>
          <Panel>
            <List>
              {events.map((event, index) => (
                <Event
                  key={event.id}
                  id={event.id}
                  name={event.name[i18n.language]}
                  type={getEventType(event.terms)}
                  location={event.location.name[i18n.language]}
                  calendarType={event.calendarType}
                  css={
                    index !== events.length - 1
                      ? (props) => {
                          return `border-bottom: 1px solid ${getValue(
                            'borderColor',
                          )(props)};`;
                        }
                      : undefined
                  }
                />
              ))}
            </List>
          </Panel>
        </>
      )}
    </Stack>
  );
};

Events.propTypes = {
  ...stackPropTypes,
  events: PropTypes.array,
  activeProductionName: PropTypes.string,
  className: PropTypes.string,
  loading: PropTypes.bool,
};

Events.defaultProps = {
  events: [],
  loading: false,
};

export { Events };
