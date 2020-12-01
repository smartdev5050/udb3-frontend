import PropTypes from 'prop-types';
import { JobLoggerStates } from './JobLogger';
import { WarningIcon } from './WarningIcon';
import { BusyIcon } from './BusyIcon';
import { CompleteIcon } from './CompleteIcon';
import { getBoxProps } from '../publiq-ui/Box';

const JobStatusIcon = ({ status, width, height, className, ...props }) => {
  const iconProps = {
    width,
    height,
    className,
    ...getBoxProps(props),
  };

  switch (status) {
    case JobLoggerStates.WARNING:
      return <WarningIcon {...iconProps} />;
    case JobLoggerStates.BUSY:
      return <BusyIcon {...iconProps} />;
    case JobLoggerStates.COMPLETE:
      return <CompleteIcon {...iconProps} />;
    default:
      return null;
  }
};

JobStatusIcon.propTypes = {
  status: PropTypes.oneOf(Object.values(JobLoggerStates)),
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string,
};

JobStatusIcon.defaultProps = {
  width: 20,
  height: 20,
};

export { JobStatusIcon };
