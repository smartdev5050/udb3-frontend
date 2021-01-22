import { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Icons } from './publiq-ui/Icon';
import { Title } from './publiq-ui/Title';
import { Link } from './publiq-ui/Link';
import { getValueFromTheme } from './publiq-ui/theme';
import { Stack } from './publiq-ui/Stack';
import { Translation } from 'react-i18next';

const getValue = getValueFromTheme('pageError');

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Translation>
          {({ t }) => (
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
              {/* <Title size={2}>{t('error.sub_title')}</Title> */}
              <Link href="/dashboard" width="max-content">
                {t('error.redirect')}
              </Link>
            </Stack>
          )}
        </Translation>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

export { ErrorBoundary };
