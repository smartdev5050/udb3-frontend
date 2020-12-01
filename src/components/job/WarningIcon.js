import PropTypes from 'prop-types';
import { Box } from '../publiq-ui/Box';

const WarningIcon = ({ className, ...props }) => {
  return (
    <Box
      className={className}
      as="svg"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="10 30 20 20"
      {...props}
    >
      <g className="warning">
        <circle id="warning-background" cx="20" cy="40" r="10" />
        <circle id="warning-circle" cx="20" cy="40" r="8" />
        <g transform="translate(-50,-1.666667)">
          <path
            id="warning-remark"
            d="M68.798,45.538c0-0.383,0.103-0.672,0.308-0.868s0.504-0.294,0.896-0.294c0.378,0,0.671,0.1,0.878,0.301 c0.208,0.201,0.312,0.488,0.312,0.861c0,0.36-0.104,0.644-0.314,0.851S70.375,46.7,70.001,46.7c-0.383,0-0.679-0.102-0.889-0.304 S68.798,45.907,68.798,45.538z M70.842,43.2h-1.668l-0.349-6.679h2.365L70.842,43.2z"
          />
        </g>
      </g>
    </Box>
  );
};

WarningIcon.propTypes = {
  className: PropTypes.string,
};

export { WarningIcon };
