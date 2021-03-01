import PropTypes from 'prop-types';
import App from '../../pages/_app';

const TestApp = ({ children }) => <App>{children}</App>;

TestApp.propTypes = {
  children: PropTypes.node,
};

export { TestApp };
