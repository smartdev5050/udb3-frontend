import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, boxPropTypes, getBoxProps } from './Box';
import {
  faFlag,
  faHome,
  faLayerGroup,
  faPlusCircle,
  faSearch,
  faTag,
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
};

const Icon = ({ name, className, ...props }) => {
  return (
    <Box className={className} {...getBoxProps(props)}>
      <FontAwesomeIcon icon={IconsMap[name]} />
    </Box>
  );
};

Icon.propTypes = {
  ...boxPropTypes,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export { Icon, Icons };
