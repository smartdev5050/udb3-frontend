import { Component } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      Router.push({
        pathname: '/error',
        query: { errorMessage: this.state.error.message },
      });
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

export { ErrorBoundary };
