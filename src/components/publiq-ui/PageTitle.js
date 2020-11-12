import PropTypes from 'prop-types';
import { boxPropTypes, getBoxProps } from './Box';
import { getValueFromTheme } from './theme';
import { Title } from './Title';

const getValue = getValueFromTheme('pageTitle');

const PageTitle = ({ children, className, ...props }) => (
  <Title
    size={1}
    className={className}
    {...getBoxProps(props)}
    css={`
      width: 100%;
      line-height: 3.74rem;
      color: ${getValue('color')};
      border-bottom: 1px solid ${getValue('borderColor')};
    `}
  >
    {children}
  </Title>
);

PageTitle.propTypes = {
  ...boxPropTypes,
  className: PropTypes.string,
  children: PropTypes.node,
};

export { PageTitle };
