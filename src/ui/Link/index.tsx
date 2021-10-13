import NextLink from 'next/link';
import type { ReactNode } from 'react';
import { cloneElement, forwardRef } from 'react';

import type { Values } from '@/types/Values';
import { Button } from '@/ui/Button';

import type { Icons } from '../Icon';
import { Icon } from '../Icon';
import type { InlineProps } from '../Inline';
import { getInlineProps, Inline } from '../Inline';
import { Text } from '../Text';
import { linkCSS } from './style';

const LinkButtonVariants = {
  BUTTON_PRIMARY: 'primary',
  BUTTON_SECONDARY: 'secondary',
  BUTTON_DANGER: 'danger',
  BUTTON_SUCCESS: 'success',
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
        css={linkCSS}
        {...getInlineProps(props)}
      >
        {children}
      </Inline>
    );
  },
);

BaseLink.displayName = 'BaseLink';

BaseLink.defaultProps = {
  as: 'a',
};

type LinkProps = BaseLinkProps & {
  href: string;
  iconName?: Values<typeof Icons>;
  suffix?: ReactNode;
};

const Link = ({
  href,
  iconName,
  suffix,
  children,
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
    typeof children === 'string' ? (
      <Text flex={1} textAlign="left" key="text">
        {children}
      </Text>
    ) : (
      children
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

export { Link, linkCSS, LinkVariants };
