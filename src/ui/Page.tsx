import type { ReactNode } from 'react';
import { Children } from 'react';

import { getBoxProps } from './Box';
import type { InlineProps } from './Inline';
import { getInlineProps, Inline } from './Inline';
import type { StackProps } from './Stack';
import { getStackProps, Stack } from './Stack';
import { getValueFromTheme } from './theme';
import type { TitleProps } from './Title';
import { Title } from './Title';

const getValueForPage = getValueFromTheme('page');
const getValueForPageFooter = getValueFromTheme('pageFooter');

type Props = StackProps & {
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
  // @ts-expect-error
  const footer = children.find((child) => child.type === PageFooter);

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
      spacing={5}
      position="relative"
      {...getStackProps(props)}
    >
      <Inline
        forwardedAs="div"
        alignItems="baseline"
        css={`
          border-bottom: 1px solid ${getValueForTitle('borderColor')};
        `}
        spacing={3}
        paddingX={4}
      >
        {title}
        {actions}
      </Inline>
      <Stack paddingX={4} flex={1}>
        {content}
      </Stack>
      {footer}
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

type PageActionsProps = InlineProps;

const PageActions = ({ children, className, ...props }: PageActionsProps) => (
  <Inline className={className} spacing={3} {...getInlineProps(props)}>
    {children}
  </Inline>
);

type PageContentProps = StackProps;

const PageContent = ({ children, className, ...props }: PageContentProps) => (
  <Stack className={className} spacing={3} {...getStackProps(props)}>
    {children}
  </Stack>
);

type PageFooterProps = InlineProps;

const PageFooter = ({ children, className, ...props }: PageFooterProps) => (
  <Inline
    className={className}
    spacing={3}
    {...getInlineProps(props)}
    position="sticky"
    left="0"
    bottom="0"
    right="0"
    zIndex={getValueForPageFooter('zIndex')}
    backgroundColor="white"
    padding={4}
    css={`
      border-top: 1px solid ${getValueForPage('borderColor')};
    `}
  >
    {children}
  </Inline>
);

Page.Title = PageTitle;
Page.Actions = PageActions;
Page.Content = PageContent;
Page.Footer = PageFooter;

export { Page };
