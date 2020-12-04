import PropTypes from 'prop-types';
import { memo } from 'react';
import { Box } from '../publiq-ui/Box';
import { getValueFromTheme } from '../publiq-ui/theme';
import { JobLoggerStates } from './JobLogger';

const getValue = getValueFromTheme('jobStatusIcon');

const BusyIcon = ({ className }) => (
  <Box
    className={className}
    forwardedAs="svg"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="10 30 20 20"
    css="overflow: visible;"
    width={20}
    height={20}
  >
    <g className="busy" fillRule="evenodd" fill="none">
      <circle
        css={`
          fill: ${getValue('backgroundColor')};
        `}
        id="busy-background"
        cx="20"
        cy="40"
        r="10"
      />
      <g
        css={`
          stroke: ${getValue('busy.spinnerStrokeColor')};
        `}
        strokeWidth="2"
        transform="translate(14 34)"
        className="busy-spinner"
      >
        <path d="M12 6c0-6-6-6-6-6" transform="rotate(308.674 6 6)">
          <animateTransform
            repeatCount="indefinite"
            dur="1s"
            to="360 6 6"
            from="0 6 6"
            type="rotate"
            attributeName="transform"
          />
        </path>
      </g>
    </g>
  </Box>
);

BusyIcon.propTypes = {
  className: PropTypes.string,
};

const CompleteIcon = ({ className }) => (
  <Box
    className={className}
    forwardedAs="svg"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="10 30 20 20"
    css={`
      overflow: visible;
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

      animation: bounceIn 0.75s 1 linear;
      -webkit-animation: bounceIn 0.75s 1 linear;
    `}
    width={20}
    height={20}
  >
    <g className="complete" fillRule="evenodd" fill="none">
      <circle
        css={`
          fill: ${getValue('backgroundColor')};
        `}
        id="complete-background"
        cx="20"
        cy="40"
        r="10"
      />
      <circle
        css={`
          fill: ${getValue('complete.circleFillColor')};
        `}
        id="complete-circle"
        cx="20"
        cy="40"
        r="8"
      />
      <g
        css={`
          fill: ${getValue('complete.checkFillColor')};
        `}
        strokeWidth="2"
        transform="translate(-6 14)"
        id="complete-check"
      >
        <path
          d="M31.162,24.359l-4.612,4.611l-0.864,0.867c-0.115,0.114-0.274,0.178-0.434,0.178s-0.318-0.063-0.433-0.178
    l-0.866-0.867l-2.307-2.307c-0.115-0.114-0.179-0.272-0.179-0.432c0-0.16,0.063-0.318,0.179-0.433l0.866-0.867
    c0.115-0.115,0.273-0.179,0.434-0.179c0.159,0,0.317,0.063,0.433,0.179l1.873,1.88l4.178-4.186
    c0.115-0.115,0.275-0.179,0.434-0.179c0.159,0,0.318,0.063,0.433,0.179l0.866,0.866c0.116,0.114,0.179,0.273,0.179,0.434
    C31.341,24.086,31.278,24.244,31.162,24.359z"
        />
      </g>
    </g>
  </Box>
);

CompleteIcon.propTypes = {
  className: PropTypes.string,
};

const WarningIcon = ({ className }) => (
  <Box
    className={className}
    forwardedAs="svg"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="10 30 20 20"
    css="overflow: visible;"
    width={20}
    height={20}
  >
    <g
      className="warning"
      css={`
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

        animation: bounce 1s infinite linear;
        -webkit-animation: bounce 1s infinite linear;
      `}
    >
      <circle
        css={`
          fill: ${getValue('backgroundColor')};
        `}
        id="warning-background"
        cx="20"
        cy="40"
        r="10"
      />
      <circle
        css={`
          fill: ${getValue('warning.circleFillColor')};
        `}
        id="warning-circle"
        cx="20"
        cy="40"
        r="8"
      />
      <g transform="translate(-50,-1.666667)">
        <path
          css={`
            fill: ${getValue('warning.remarkFillColor')};
          `}
          id="warning-remark"
          d="M68.798,45.538c0-0.383,0.103-0.672,0.308-0.868s0.504-0.294,0.896-0.294c0.378,0,0.671,0.1,0.878,0.301 c0.208,0.201,0.312,0.488,0.312,0.861c0,0.36-0.104,0.644-0.314,0.851S70.375,46.7,70.001,46.7c-0.383,0-0.679-0.102-0.889-0.304 S68.798,45.907,68.798,45.538z M70.842,43.2h-1.668l-0.349-6.679h2.365L70.842,43.2z"
        />
      </g>
    </g>
  </Box>
);

WarningIcon.propTypes = {
  className: PropTypes.string,
};

const ComponentMap = {
  [JobLoggerStates.WARNING]: <WarningIcon />,
  [JobLoggerStates.COMPLETE]: <CompleteIcon />,
  [JobLoggerStates.BUSY]: <BusyIcon />,
};

const JobLoggerStateIndicator = memo(
  ({ state }) => ComponentMap[state] ?? null,
);

JobLoggerStateIndicator.propTypes = {
  state: PropTypes.oneOf(Object.values(JobLoggerStates)),
};

export { JobLoggerStateIndicator };
