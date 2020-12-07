import PropTypes from 'prop-types';
import { getStackProps, Stack, stackPropTypes } from '../../publiq-ui/Stack';

const Events = ({ events, className, ...props }) => {
  return <Stack {...getStackProps(props)} />;
};

Events.propTypes = {
  ...stackPropTypes,
  events: PropTypes.array,
  className: PropTypes.string,
};

export { Events };
