import PropTypes from 'prop-types';
import { getStackProps, Stack, stackPropTypes } from './Stack';
import { getValueFromTheme } from './theme';

import { Title } from './Title';
import { Link } from './Link';
import { Text } from './Text';
import { getInlineProps, Inline, inlinePropTypes } from './Inline';

const getValueForPage = getValueFromTheme('page');

const Page = ({ children, className, ...props }) => (
  <Stack
    forwardedAs="main"
    className={className}
    flex={1}
    backgroundColor={getValueForPage('backgroundColor')}
    minHeight="100vh"
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

const PageTitle = ({
  children,
  actionTitle,
  actionHref,
  className,
  ...props
}) => (
  <Inline
    forwardedAs="div"
    alignItems="baseline"
    css={`
      border-bottom: 1px solid ${getValueForTitle('borderColor')};
    `}
    marginBottom={5}
    spacing={3}
    {...getInlineProps(props)}
  >
    <Title
      size={1}
      className={className}
      color={getValueForTitle('color')}
      lineHeight="220%"
    >
      {children}
    </Title>
    {actionTitle && (
      <Link href={actionHref} css="text-transform: lowercase;">
        <Text>{actionTitle}</Text>
      </Link>
    )}
  </Inline>
);

PageTitle.propTypes = {
  ...inlinePropTypes,
  actionTitle: PropTypes.string,
  actionHref: PropTypes.string,
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
