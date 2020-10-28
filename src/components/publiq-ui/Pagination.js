import { Pagination as BootstrapPagination } from 'react-bootstrap';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { getValueFromTheme } from './getValueFromTheme';

const getValue = (path) => (props) =>
  getValueFromTheme(props, `components.pagination.${path}`);

const StyledPagination = styled(BootstrapPagination)`
  .page-link {
    color: ${getValue('color')};
    border-color: ${getValue('borderColor')};
    padding: ${getValue('paddingY')} ${getValue('paddingX')};
    &:hover {
      background-color: ${getValue('hoverBackgroundColor')};
      color: ${getValue('hoverColor')};
    }
    &:focus {
      box-shadow: ${getValue('focusBoxShadow')};
    }
  }

  & > .page-item.active > .page-link {
    background-color: ${getValue('activeBackgroundColor')};
    color: ${getValue('activeColor')};
    border-color: ${getValue('activeBorderColor')};
  }
`;

const Pagination = ({
  currentPage,
  totalItems,
  perPage,
  prevText,
  nextText,
  onChangePage,
}) => {
  return (
    <StyledPagination>
      <StyledPagination.Prev>{prevText}</StyledPagination.Prev>
      <StyledPagination.Item>1</StyledPagination.Item>
      <StyledPagination.Item active>2</StyledPagination.Item>
      <StyledPagination.Item>3</StyledPagination.Item>
      <StyledPagination.Item>4</StyledPagination.Item>
      <StyledPagination.Next>{nextText}</StyledPagination.Next>
    </StyledPagination>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number,
  totalItems: PropTypes.number,
  perPage: PropTypes.number,
  prevText: PropTypes.string,
  nextText: PropTypes.string,
  onChangePage: PropTypes.func,
};

Pagination.defaultProps = {
  currentPage: 1,
  totalItems: 1,
  perPage: 10,
  prevText: 'Previous',
  nextText: 'Next',
};

export { Pagination };
