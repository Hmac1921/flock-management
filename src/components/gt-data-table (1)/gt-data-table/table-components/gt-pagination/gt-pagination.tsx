import { ChevronLeft, ChevronRight, FirstPage, LastPage } from '@mui/icons-material';
import { MouseEvent } from 'react';

type GTPaginationProps = {
  payload: {
    pageCount: number;
    page: number;
  };
  count: number;
  onChange: (payload: { pageCount: number; page: number }) => void;
};

const GTPagination = ({ payload, count, onChange }: GTPaginationProps) => {
  const currentPage = payload.page;
  const lastPageNumber = Math.max(1, Math.ceil(count / payload.pageCount));

  const pagStrings = {
    FIRST_PAGE: 'first-page',
    LAST_PAGE: 'last-page',
    PREV_PAGE: 'prev-page',
    NEXT_PAGE: 'next-page',
    PAGE_NUMBER: 'page-number',
  };

  const cssClassNames = {
    available: 'hover:text-[var(--text-hover)]',
    disabled: 'text-[var(--muidefaults-action-disabled)]',
  };

  const handleClick = (e: MouseEvent) => {
    switch (e.currentTarget.id) {
      case pagStrings.FIRST_PAGE: {
        if (currentPage <= 1) {
          return;
        } else {
          onChange({ ...payload, page: 1 });

          return;
        }
      }

      case pagStrings.LAST_PAGE: {
        if (currentPage < lastPageNumber) {
          onChange({ ...payload, page: lastPageNumber });

          return;
        } else {
          return;
        }
      }

      case pagStrings.PREV_PAGE: {
        if (currentPage <= 1) {
          return;
        } else {
          onChange({ ...payload, page: currentPage - 1 });

          return;
        }
      }

      case pagStrings.NEXT_PAGE: {
        if (currentPage < lastPageNumber) {
          onChange({ ...payload, page: currentPage + 1 });

          return;
        } else {
          return;
        }
      }

      default:
        break;
    }
  };

  return (
    <div className="flex justify-end items-center ">
      <div
        className={currentPage >= 2 ? cssClassNames.available : cssClassNames.disabled}
        id={pagStrings.FIRST_PAGE}
        onClick={handleClick}>
        <FirstPage />
      </div>
      <div
        className={currentPage >= 2 ? cssClassNames.available : cssClassNames.disabled}
        id={pagStrings.PREV_PAGE}
        onClick={handleClick}>
        <ChevronLeft />
      </div>
      <div className="px-2 ">
        <p>
          {`${currentPage}`} / {`${lastPageNumber}`}
        </p>
      </div>
      <div
        className={currentPage < lastPageNumber ? cssClassNames.available : cssClassNames.disabled}
        id={pagStrings.NEXT_PAGE}
        onClick={handleClick}>
        <ChevronRight />
      </div>
      <div
        className={currentPage < lastPageNumber ? cssClassNames.available : cssClassNames.disabled}
        id={pagStrings.LAST_PAGE}
        onClick={handleClick}>
        <LastPage />
      </div>
    </div>
  );
};

export default GTPagination;
