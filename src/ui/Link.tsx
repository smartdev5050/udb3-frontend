import NextLink from 'next/link';
import type { ReactNode } from 'react';
import { cloneElement, forwardRef } from 'react';

import type { Values } from '@/types/Values';
import { Button, ButtonVariants } from '@/ui/Button';

import type { Icons } from './Icon';
import { Icon } from './Icon';
import type { InlineProps } from './Inline';
import { getInlineProps, Inline } from './Inline';
import { Text } from './Text';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme('link');

const LinkButtonVariants = {
  BUTTON_PRIMARY: ButtonVariants.PRIMARY,
  BUTTON_SECONDARY: ButtonVariants.SECONDARY,
  BUTTON_DANGER: ButtonVariants.DANGER,
  BUTTON_SUCCESS: ButtonVariants.SUCCESS,
} as const;

const LinkVariants = {
  ...LinkButtonVariants,
  UNSTYLED: 'unstyled',
} as const;

type BaseLinkProps = InlineProps & {
  variant?: Values<typeof LinkVariants>;
};

const BaseLink = forwardRef<HTMLElement, BaseLinkProps>(
  ({ href, variant, title, children, className, as, ...props }, ref) => {
    if (variant === LinkVariants.UNSTYLED) {
      return (
        <Inline
          className={className}
          href={href}
          ref={ref}
          as={as}
          title={title}
          display="inline-flex"
          color={{ default: 'inherit', hover: 'inherit' }}
          alignItems="center"
          {...getInlineProps(props)}
        >
          {children}
        </Inline>
      );
    }

    if (Object.values(LinkButtonVariants).includes(variant)) {
      return (
        <Inline
          className={className}
          href={href}
          ref={ref}
          as={as}
          display="inline-flex"
          alignItems="center"
          {...getInlineProps(props)}
        >
          <Button forwardedAs="span" variant={variant}>
            {children}
          </Button>
        </Inline>
      );
    }

    return (
      <Inline
        className={className}
        href={href}
        ref={ref}
        forwardedAs={as}
        color={{ default: getValue('color'), hover: getValue('color') }}
        display="inline-flex"
        fontWeight={400}
        css={`
          &:hover {
            text-decoration: underline;
          }
        `}
        {...getInlineProps(props)}
      >
        {children}
      </Inline>
    );
  },
);

BaseLink.displayName = 'BaseLink';

type LinkProps = BaseLinkProps & {
  href: string;
  iconName?: Values<typeof Icons>;
  suffix?: ReactNode;
  customChildren?: boolean;
  shouldHideText?: boolean;
};

const Link = ({
  href,
  iconName,
  suffix,
  children,
  customChildren,
  shouldHideText,
  className,
  variant,
  title,
  as,
  ...props
}: LinkProps) => {
  const isInternalLink = [
    (val: string) => val.startsWith('/'),
    (val: string) => val.startsWith('#'),
  ].some((predicate) => predicate(href));

  const clonedSuffix = suffix
    ? // @ts-expect-error
      cloneElement(suffix, {
        // @ts-expect-error
        ...suffix.props,
        key: 'suffix',
        css: `align-self: flex-end`,
      })
    : undefined;

  const inner = [
    iconName && <Icon name={iconName} key="icon" />,
    customChildren
      ? children
      : !shouldHideText && (
          <Text flex={1} textAlign="left" key="text">
            {children}
          </Text>
        ),
    clonedSuffix,
  ];

  if (href === '') {
    return (
      <BaseLink
        as={as}
        className={className}
        variant={variant}
        title={title}
        {...getInlineProps(props)}
      >
        {inner}
      </BaseLink>
    );
  }

  if (isInternalLink) {
    return (
      <NextLink
        href={href}
        passHref={!!href}
        {...(process.env.STORYBOOK ? { prefetch: false } : {})}
      >
        <BaseLink
          as={as}
          className={className}
          variant={variant}
          title={title}
          {...getInlineProps(props)}
        >
          {inner}
        </BaseLink>
      </NextLink>
    );
  }

  return (
    <BaseLink
      as={as}
      href={href}
      className={className}
      variant={variant}
      rel="noopener"
      target="_blank"
      title={title}
      {...getInlineProps(props)}
    >
      {inner}
    </BaseLink>
  );
};

Link.defaultProps = {
  customChildren: false,
  shouldHideText: false,
};

export { Link, LinkVariants };
