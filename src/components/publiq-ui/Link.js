import NextLink from 'next/link';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme('link');

const StyledLink = styled.a`
  font-weight: 400;
  color: ${getValue('color')};
  flex &:hover {
    text-decoration: underline;
    color: ${getValue('color')};
  }
`;

const Link = ({ href, children, as, className }) => {
  const isInternalLink = href.startsWith('/');

  if (isInternalLink) {
    return (
      <NextLink prefetch href={href} passHref>
        <StyledLink as={as} className={className}>
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
    >
      {children}
    </StyledLink>
  );
};

Link.propTypes = {
  href: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  as: PropTypes.node,
};

export { Link };
