import { getStackProps, Stack } from './Stack';
import { getValueFromTheme } from './theme';
import { Title } from './Title';
import { getInlineProps, Inline } from './Inline';
import { Children, ReactNode } from 'react';
import { getBoxProps } from './Box';
import type { TitleProps } from './Title';
import type { InlineProps } from './Inline';
import type { StackProps } from './Stack';

const getValueForPage = getValueFromTheme('page');

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

type PageActionsProps = InlineProps;

const PageActions = ({ children, className, ...props }: PageActionsProps) => (
  <Inline className={className} spacing={3} {...getInlineProps(props)}>
    {children}
  </Inline>
);

type PageContentProps = InlineProps;

const PageContent = ({ children, className, ...props }: PageContentProps) => (
  <Stack className={className} spacing={3} {...getStackProps(props)}>
    {children}
  </Stack>
);

Page.Title = PageTitle;
Page.Actions = PageActions;
Page.Content = PageContent;

export { Page };
