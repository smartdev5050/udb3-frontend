import { Pagination as BootstrapPagination } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { getValueFromTheme } from './theme';
import { getInlineProps, Inline, inlinePropTypes } from './Inline';

const getValue = getValueFromTheme(`pagination`);

const Pagination = ({
  className,
  currentPage,
  totalItems,
  perPage,
  prevText,
  nextText,
  onChangePage,
  ...props
}) => {
  const pages = [];
  for (let i = 0; i < Math.ceil(totalItems / perPage); i++) {
    pages.push(i + 1);
  }

  return (
    <Inline
      forwardedAs="ul"
      css={`
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

        .prev-btn {
          margin-right: 0.2rem;
        }

        .next-btn {
          margin-left: 0.2rem;
        }
      `}
      {...getInlineProps(props)}
      className={className}
    >
      <BootstrapPagination.Prev
        className="prev-btn"
        disabled={currentPage === 1}
        onClick={() => {
          if (currentPage > 1) {
            onChangePage(currentPage - 1);
          }
        }}
      >
        {prevText}
      </BootstrapPagination.Prev>
      {pages.map((page) => (
        <BootstrapPagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => {
            onChangePage(page);
          }}
        >
          {page}
        </BootstrapPagination.Item>
      ))}
      <BootstrapPagination.Next
        className="next-btn"
        disabled={currentPage === pages.length}
        onClick={() => {
          if (currentPage < pages.length) {
            onChangePage(currentPage + 1);
          }
        }}
      >
        {nextText}
      </BootstrapPagination.Next>
    </Inline>
  );
};

Pagination.propTypes = {
  ...inlinePropTypes,
  className: PropTypes.string,
  currentPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
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
  onChangePage: () => {},
};

export { Pagination };
