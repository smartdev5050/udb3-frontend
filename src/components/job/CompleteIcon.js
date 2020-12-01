import PropTypes from 'prop-types';
import { Box } from '../publiq-ui/Box';
import { getValueFromTheme } from '../publiq-ui/theme';

const getValue = getValueFromTheme('jobStatusIcon');

const CompleteIcon = ({ className, ...props }) => {
  return (
    <Box
      className={className}
      forwardedAs="svg"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="10 30 20 20"
      css="overflow: visible;"
      {...props}
    >
      <g
        css={`
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
        className="complete"
        fillRule="evenodd"
        fill="none"
      >
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
};

CompleteIcon.propTypes = {
  className: PropTypes.string,
};

export { CompleteIcon };
