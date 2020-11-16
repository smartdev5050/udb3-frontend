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
  home: faHome,
  plusCircle: faPlusCircle,
  search: faSearch,
  flag: faFlag,
  user: faUser,
  users: faUsers,
  tag: faTag,
  slideShare: faSlideshare,
  layerGroup: faLayerGroup,
};

const Icon = ({ name, className, ...props }) => {
  return (
    <Box className={className} {...getBoxProps(props)}>
      <FontAwesomeIcon className={className} icon={IconsMap[name]} />
    </Box>
  );
};

Icon.propTypes = {
  ...boxPropTypes,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export { Icon, Icons };
