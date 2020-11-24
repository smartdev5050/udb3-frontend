import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, boxPropTypes, getBoxProps } from './Box';
import {
  faBell,
  faEye,
  faEyeSlash,
  faFlag,
  faGift,
  faHome,
  faLayerGroup,
  faPlusCircle,
  faSearch,
  faSignOutAlt,
  faTag,
  faTimes,
  faUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { faSlideshare } from '@fortawesome/free-brands-svg-icons';

const Icons = {
  HOME: 'home',
  PLUS_CIRCLE: 'plusCircle',
  SEARCH: 'search',
  FLAG: 'flag',
  USER: 'user',
  USERS: 'users',
  TAG: 'tag',
  SLIDE_SHARE: 'slideShare',
  LAYER_GROUP: 'layerGroup',
  BELL: 'bell',
  GIFT: 'gift',
  TIMES: 'times',
  EYE: 'eye',
  EYE_SLASH: 'eyeSlash',
  SIGN_OUT_ALT: 'signOutAlt',
};

const IconsMap = {
  [Icons.HOME]: faHome,
  [Icons.PLUS_CIRCLE]: faPlusCircle,
  [Icons.SEARCH]: faSearch,
  [Icons.FLAG]: faFlag,
  [Icons.USER]: faUser,
  [Icons.USERS]: faUsers,
  [Icons.TAG]: faTag,
  [Icons.SLIDE_SHARE]: faSlideshare,
  [Icons.LAYER_GROUP]: faLayerGroup,
  [Icons.BELL]: faBell,
  [Icons.GIFT]: faGift,
  [Icons.TIMES]: faTimes,
  [Icons.EYE]: faEye,
  [Icons.EYE_SLASH]: faEyeSlash,
  [Icons.SIGN_OUT_ALT]: faSignOutAlt,
};

const Icon = ({ name, width, height, className, ...props }) => {
  return (
    <Box className={className} {...getBoxProps(props)}>
      <FontAwesomeIcon
        css={`
          &.svg-inline--fa {
            width: ${width}px;
            height: ${height}px;
          }
        `}
        icon={IconsMap[name]}
      />
    </Box>
  );
};

Icon.propTypes = {
  ...boxPropTypes,
  name: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string,
};

Icon.defaultProps = {
  width: 15,
  height: 15,
};

export { Icon, Icons };
