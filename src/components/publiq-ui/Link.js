import NextLink from 'next/link';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getValueFromTheme } from './theme';
import { getBoxProps, boxProps, boxPropTypes } from './Box';

const getValue = getValueFromTheme('link');

const StyledLink = styled.a`
  font-weight: 400;
  color: ${getValue('color')};
  &:hover {
    text-decoration: underline;
    color: ${getValue('color')};
  }

  ${boxProps}
`;

const Link = ({ href, children, as, className, ...props }) => {
  const isInternalLink = href.startsWith('/');

  if (isInternalLink) {
    return (
      <NextLink href={href} passHref>
        <StyledLink as={as} className={className} {...getBoxProps(props)}>
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
      {...getBoxProps(props)}
    >
      {children}
    </StyledLink>
  );
};

Link.propTypes = {
  ...boxPropTypes,
  href: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  as: PropTypes.node,
};

export { Link };
