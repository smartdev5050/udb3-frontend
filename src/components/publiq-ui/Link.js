import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { getValueFromTheme } from './theme';
import { getInlineProps, Inline, inlinePropTypes } from './Inline';
import { cloneElement, forwardRef } from 'react';
import { Box } from './Box';
import { Icon } from './Icon';

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
  children: label,
  className,
  variant,
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

  const children = [
    iconName && <Icon name={iconName} key="icon" />,
    <Box forwardAs="span" flex={1} css="text-align: left" key="text">
      {label}
    </Box>,
    clonedSuffix,
  ];

  if (isInternalLink) {
    return (
      <NextLink href={href} passHref>
        <BaseLink
          className={className}
          variant={variant}
          {...getInlineProps(props)}
        >
          {children}
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
      {...getInlineProps(props)}
    >
      {children}
    </BaseLink>
  );
};

Link.propTypes = {
  ...inlinePropTypes,
  href: PropTypes.string,
  iconName: PropTypes.string,
  suffix: PropTypes.node,
  className: PropTypes.string,
  children: PropTypes.node,
  as: PropTypes.node,
};

export { Link, LinkVariants };
