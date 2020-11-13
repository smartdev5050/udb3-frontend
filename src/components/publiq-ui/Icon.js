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

const IconVariants = {
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

const Icons = {
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

const Icon = ({ variant, className, ...props }) => {
  return (
    <Box as={FontAwesomeIcon} icon={Icons[variant]} {...getBoxProps(props)} />
  );
};

Icon.propTypes = {
  ...boxPropTypes,
  variant: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export { Icon, IconVariants };
