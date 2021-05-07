import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { cloneElement, forwardRef } from 'react';

import { Button, ButtonVariants } from '@/ui/Button';

import { Icon } from './Icon';
import { getInlineProps, Inline } from './Inline';
import { Text } from './Text';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme('link');

const LinkButtonVariants = {
  BUTTON_PRIMARY: ButtonVariants.PRIMARY,
  BUTTON_SECONDARY: ButtonVariants.SECONDARY,
  BUTTON_DANGER: ButtonVariants.DANGER,
  BUTTON_SUCCESS: ButtonVariants.SUCCESS,
};

const LinkVariants = {
  UNSTYLED: 'unstyled',
  ...LinkButtonVariants,
};

const BaseLink = forwardRef(({ variant, children, ...props }, ref) => {
  if (variant === LinkVariants.UNSTYLED) {
    return (
      <Inline
        ref={ref}
        forwardedAs="a"
        display="inline-flex"
        color={{ default: 'inherit', hover: 'inherit' }}
        alignItems="center"
        {...props}
      >
        {children}
      </Inline>
    );
  }

  if (Object.values(LinkButtonVariants).includes(variant)) {
    return (
      <Inline
        ref={ref}
        forwardedAs="a"
        display="inline-flex"
        alignItems="center"
        {...props}
      >
        <Button forwardedAs="span" variant={variant}>
          {children}
        </Button>
      </Inline>
    );
  }

  return (
    <Inline
      ref={ref}
      forwardedAs="a"
      color={{ default: getValue('color'), hover: getValue('color') }}
      display="inline-flex"
      css={`
        font-weight: 400;
        &:hover {
          text-decoration: underline;
        }
      `}
      {...props}
    >
      {children}
    </Inline>
  );
});

BaseLink.propTypes = {
  variant: PropTypes.string,
  children: PropTypes.node,
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
  ...props
}) => {
  const isInternalLink = href.startsWith('/');

  const clonedSuffix = suffix
    ? cloneElement(suffix, {
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

  if (isInternalLink) {
    return (
      <NextLink
        href={href}
        passHref
        {...(process.env.STORYBOOK ? { prefetch: false } : {})}
      >
        <BaseLink
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

Link.propTypes = {
  href: PropTypes.string,
  title: PropTypes.string,
  iconName: PropTypes.string,
  suffix: PropTypes.node,
  className: PropTypes.string,
  children: PropTypes.node,
  customChildren: PropTypes.bool,
  shouldHideText: PropTypes.bool,
  as: PropTypes.node,
};

Link.defaultProps = {
  customChildren: false,
  shouldHideText: false,
};

export { Link, LinkVariants };
