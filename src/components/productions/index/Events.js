import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { List } from '../../publiq-ui/List';
import { getStackProps, Stack, stackPropTypes } from '../../publiq-ui/Stack';
import { Title } from '../../publiq-ui/Title';
import { Spinner } from '../../publiq-ui/Spinner';
import { CheckboxWithLabel } from '../../publiq-ui/CheckboxWithLabel';
import { Button, ButtonVariants } from '../../publiq-ui/Button';
import { Icon, Icons } from '../../publiq-ui/Icon';
import { useState } from 'react';
import { getValueFromTheme } from '../../publiq-ui/theme';
import { Panel } from '../../publiq-ui/Panel';

const getValue = getValueFromTheme('eventItem');

const Event = ({ id, name, type, date, place, className }) => {
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
      justifyContent="space-between"
      backgroundColor="white"
      className={className}
    >
      <CheckboxWithLabel id={id} name={name}>
        {name}
      </CheckboxWithLabel>
      <Button
        onClick={handleClickToggleExpand}
        variant={ButtonVariants.UNSTYLED}
      >
        <Icon name={isExpanded ? Icons.CHEVRON_DOWN : Icons.CHEVRON_RIGHT} />
      </Button>
    </List.Item>
  );
};

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
    <Stack spacing={4} {...getStackProps(props)}>
      <Title>
        {t('productions.overview.events_in_production', {
          productionName: activeProductionName,
        })}
      </Title>
      <Panel>
        <List>
          {events.map((event, index) => (
            <Event
              key={event['@id']}
              id={event['@id']}
              name={event.name.nl}
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
