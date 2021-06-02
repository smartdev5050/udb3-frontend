import PropTypes from 'prop-types';
import { Component } from 'react';

import { ErrorFallback } from './ErrorFallback';

class ErrorBoundaryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (error) {
      return <ErrorFallback error={error} />;
    }

    return this.props.children;
  }
}

ErrorBoundaryComponent.propTypes = {
  children: PropTypes.node,
};

const ErrorBoundary = ErrorBoundaryComponent;

export { ErrorBoundary };
