import NextLink from 'next/link';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getValueFromTheme } from './theme';
import { getLayoutProps, spacingProps, spacingPropTypes } from './Box';

const getValue = getValueFromTheme('link');

const StyledLink = styled.a`
  font-weight: 400;
  color: ${getValue('color')};
  &:hover {
    text-decoration: underline;
    color: ${getValue('color')};
  }

  ${spacingProps}
`;

const Link = ({ href, children, as, className, ...props }) => {
  const layoutProps = getLayoutProps(props);

  const isInternalLink = href.startsWith('/');

  if (isInternalLink) {
    return (
      <NextLink prefetch href={href} passHref>
        <StyledLink as={as} className={className} {...layoutProps}>
          {children}
        </StyledLink>
      </NextLink>
    );
  }

  return (
    <StyledLink
      href={href}
      as={as}
      className={className}
      rel="noopener"
      target="_blank"
      {...layoutProps}
    >
      {children}
    </StyledLink>
  );
};

Link.propTypes = {
  ...spacingPropTypes,
  href: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  as: PropTypes.node,
};

export { Link };
