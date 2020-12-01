import PropTypes from 'prop-types';
import { getStackProps, Stack, stackPropTypes } from './Stack';
import { getValueFromTheme } from './theme';

import { boxPropTypes, getBoxProps } from './Box';
import { Title } from './Title';

const getValueForPage = getValueFromTheme('page');

const Page = ({ children, className, ...props }) => (
  <Stack
    forwardedAs="main"
    className={className}
    flex={1}
    backgroundColor={getValueForPage('backgroundColor')}
    minHeight="100vh"
    padding={3}
    css={`
      overflow-x: hidden;
      overflow-y: auto;
    `}
    paddingLeft={4}
    paddingRight={4}
    {...getStackProps(props)}
  >
    {children}
  </Stack>
);

const getValueForTitle = getValueFromTheme('pageTitle');

const PageTitle = ({ children, className, ...props }) => (
  <Title
    size={1}
    className={className}
    color={getValueForTitle('color')}
    css={`
      line-height: 220%;
      border-bottom: 1px solid ${getValueForTitle('borderColor')};
    `}
    {...getBoxProps(props)}
  >
    {children}
  </Title>
);

PageTitle.propTypes = {
  ...boxPropTypes,
  className: PropTypes.string,
  children: PropTypes.node,
};

Page.Title = PageTitle;

Page.propTypes = {
  ...stackPropTypes,
  children: PropTypes.node,
  className: PropTypes.string,
};

export { Page };
