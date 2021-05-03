import PropTypes from 'prop-types';
import { getStackProps, Stack, stackPropTypes } from './Stack';
import { getValueFromTheme } from './theme';

import { Title } from './Title';
import type { TitleProps } from './Title';
import { getInlineProps, Inline, inlinePropTypes } from './Inline';
import { Children, ReactNode } from 'react';

import { getBoxProps } from './Box';

const getValueForPage = getValueFromTheme('page');

type Props = {
  children: ReactNode;
  className?: string;
};

const Page = ({ children: rawChildren, className, ...props }: Props) => {
  const children = Children.toArray(rawChildren);

  // @ts-expect-error
  const title = children.find((child) => child.type === PageTitle);
  // @ts-expect-error
  const actions = children.find((child) => child.type === PageActions);
  // @ts-expect-error
  const content = children.find((child) => child.type === PageContent);

  return (
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
      spacing={5}
      {...getStackProps(props)}
    >
      <Inline
        forwardedAs="div"
        alignItems="baseline"
        css={`
          border-bottom: 1px solid ${getValueForTitle('borderColor')};
        `}
        spacing={3}
      >
        {title}
        {actions}
      </Inline>
      {content}
    </Stack>
  );
};

const getValueForTitle = getValueFromTheme('pageTitle');

const PageTitle = ({ children, className, ...props }: TitleProps) => (
  <Title
    size={1}
    className={className}
    color={getValueForTitle('color')}
    lineHeight="220%"
    {...getBoxProps(props)}
  >
    {children}
  </Title>
);

const PageActions = ({ children, className, ...props }) => (
  <Inline className={className} spacing={3} {...getInlineProps(props)}>
    {children}
  </Inline>
);

PageActions.propTypes = {
  ...inlinePropTypes,
  className: PropTypes.string,
  children: PropTypes.node,
};

const PageContent = ({ children, className, ...props }) => (
  <Stack className={className} spacing={3} {...getStackProps(props)}>
    {children}
  </Stack>
);

PageContent.propTypes = {
  ...inlinePropTypes,
  className: PropTypes.string,
  children: PropTypes.node,
};

Page.Title = PageTitle;
Page.Actions = PageActions;
Page.Content = PageContent;

Page.propTypes = {
  ...stackPropTypes,
  children: PropTypes.node,
  className: PropTypes.string,
};

export { Page };
