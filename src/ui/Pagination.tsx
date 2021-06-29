import { useMemo } from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';

import type { InlineProps } from './Inline';
import { getInlineProps, Inline } from './Inline';
import { getValueFromTheme } from './theme';

const getValue = getValueFromTheme(`pagination`);

type PaginationProps = InlineProps & {
  currentPage: number;
  totalItems: number;
  perPage: number;
  limitPages: number;
  prevText?: string;
  nextText?: string;
  onChangePage?: (newValue: number) => void;
};

const Pagination = ({
  className,
  currentPage,
  totalItems,
  perPage,
  limitPages,
  prevText,
  nextText,
  onChangePage,
  ...props
}: PaginationProps) => {
  const pages = useMemo(() => {
    const pages = [];
    for (let i = 0; i < Math.ceil(totalItems / perPage); i++) {
      pages.push(i + 1);
    }
    return pages;
  }, [totalItems, perPage]);

  const currentRange = useMemo(() => {
    const middle = Math.ceil(limitPages / 2);

    const startLeftSide = currentPage < middle ? 0 : currentPage - middle;
    const restFromLeft = currentPage < middle ? middle - currentPage : 0;
    const startRightSide = currentPage + middle - 1;
    const restFromRight =
      startRightSide > pages.length ? startRightSide - pages.length : 0;

    const left = pages.slice(
      startLeftSide - restFromRight < 0 ? 0 : startLeftSide - restFromRight,
      currentPage - 1,
    );
    const center = pages.slice(currentPage - 1, currentPage);
    const right = pages.slice(currentPage, startRightSide + restFromLeft);

    return [...left, ...center, ...right];
  }, [pages, currentPage, limitPages]);

  return (
    <Inline
      forwardedAs="ul"
      justifyContent="center"
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
          z-index: ${getValue('zIndex')};
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
      {pages.length > 1 && (
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
      )}
      {currentRange.map((page, index) => {
        // show ellipsis if there are more items to the left or right that are not visible
        if (
          (index === 0 && currentRange[0] !== pages[0]) ||
          (index === currentRange.length - 1 &&
            currentRange[index] !== pages[pages.length - 1])
        ) {
          return <BootstrapPagination.Ellipsis />;
        }

        return (
          <BootstrapPagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => {
              onChangePage(page);
            }}
          >
            {page}
          </BootstrapPagination.Item>
        );
      })}
      {pages.length > 1 && (
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
      )}
    </Inline>
  );
};

Pagination.defaultProps = {
  currentPage: 1,
  totalItems: 1,
  perPage: 10,
  limitPages: 5,
  prevText: 'Previous',
  nextText: 'Next',
};

export { Pagination };
