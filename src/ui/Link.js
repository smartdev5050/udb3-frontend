import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { getValueFromTheme } from './theme';
import { getInlineProps, Inline, inlinePropTypes } from './Inline';
import { cloneElement, forwardRef } from 'react';
import { Icon } from './Icon';
import { Text } from './Text';

const getValue = getValueFromTheme('link');

const LinkVariants = {
  UNSTYLED: 'unstyled',
};

const BaseLink = forwardRef(({ variant, ...props }, ref) => {
  if (variant === LinkVariants.UNSTYLED) {
    return (
      <Inline
        ref={ref}
        forwardedAs="a"
        color={{ default: 'inherit', hover: 'inherit' }}
        alignItems="center"
        css={`
          display: inline-block;
        `}
        {...props}
      />
    );
  }

  return (
    <Inline
      ref={ref}
      forwardedAs="a"
      color={{ default: getValue('color'), hover: getValue('color') }}
      css={`
        display: inline-block;
        font-weight: 400;
        &:hover {
          text-decoration: underline;
        }
      `}
      {...props}
    />
  );
});

BaseLink.propTypes = {
  variant: PropTypes.string,
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
  ...inlinePropTypes,
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
