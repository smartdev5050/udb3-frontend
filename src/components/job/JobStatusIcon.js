import PropTypes from 'prop-types';
import { JobLoggerStates } from './JobLogger';
import { getValueFromTheme } from '../publiq-ui/theme';
import { WarningIcon } from './WarningIcon';
import { BusyIcon } from './BusyIcon';
import { CompleteIcon } from './CompleteIcon';
import { getBoxProps } from '../publiq-ui/Box';

const getValue = getValueFromTheme('jobStatusIcon');

/*
css={`
        overflow: visible;

        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-30px);
          }
          60% {
            transform: translateY(-15px);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }

        #complete-background,
        #warning-background,
        #busy-background {
          fill: ${getValue('backgroundColor')};
        }

        .busy-spinner {
          stroke: ${getValue('busy.spinnerStrokeColor')};
        }

        #warning-circle {
          fill: ${getValue('warning.circleFillColor')};
        }
        #warning-remark {
          fill: ${getValue('warning.remarkFillColor')};
        }
        .warning {
          animation: bounce 1s infinite linear;
          -webkit-animation: bounce 1s infinite linear;
        }

        #complete-circle {
          fill: ${getValue('complete.circleFillColor')};
        }
        #complete-check {
          fill: ${getValue('complete.checkFillColor')};
        }
        .complete {
          animation: bounceIn 0.75s 1 linear;
          -webkit-animation: bounceIn 0.75s 1 linear;
        }
      `}
*/

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
