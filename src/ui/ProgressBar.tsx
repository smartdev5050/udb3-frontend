import { ProgressBar as BootstrapProgressBar } from 'react-bootstrap';

const ProgressBar = ({ children, className, ...props }) => {
  return <BootstrapProgressBar now={60} />;
};

ProgressBar.defaultProps = {};

export { ProgressBar };
