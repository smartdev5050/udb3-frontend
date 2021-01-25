import { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { Icon, Icons } from '../components/publiq-ui/Icon';
import { Stack } from '../components/publiq-ui/Stack';
import { Title } from '../components/publiq-ui/Title';
import { getValueFromTheme } from './publiq-ui/theme';
import { Text } from './publiq-ui/Text';

const getValue = getValueFromTheme('pageError');

class ErrorBoundaryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    const { t } = this.props;
    const { error } = this.state;
    if (error) {
      return (
        <Stack
          textAlign="center"
          alignItems="center"
          marginY={6}
          spacing={3}
          flex={1}
          height="100vh"
        >
          <Icon
            name={Icons.EXCLAMATION_TRIANGLE}
            width="10rem"
            height="auto"
            color={getValue('iconColor')}
          />
          <Title size={1}>{t('error.title')}</Title>
          <Title size={2}>
            {error.name}: {error.message}
          </Title>
          <Text maxWidth={550}>{t('error.description')}</Text>
        </Stack>
      );
    }

    return this.props.children;
  }
}

ErrorBoundaryComponent.propTypes = {
  children: PropTypes.node,
  t: PropTypes.func,
};

const ErrorBoundary = withTranslation()(ErrorBoundaryComponent);

export { ErrorBoundary };
