import { type ReactNode, useEffect } from 'react';

import { Table, useTableContext } from './gt-data-table-context';
import useRenderRows from './table-hooks/use-render-rows';

import type { ColumnProps } from './gt-data-table-types';
import GTPagination from './table-components/gt-pagination';
import GTRowCountDropdown from './table-components/gt-row-count-dropdown';
import { ACTION_TYPES } from './gt-data-table.reducer';

type GTDataTableProps<T extends Record<string, unknown> = Record<string, unknown>> = {
  toolbar?: ReactNode;
  columns?: ColumnProps<T>[];
  data?: T[];
  filters?: Partial<Record<keyof T, unknown>>;
  filterPredicate?: (row: T, filters: Partial<Record<keyof T, unknown>>) => boolean;
  pagination?: {
    page: number;
    pageCount: number;
  };
  onPaginationChange?: (payload: { page: number; pageCount: number }) => void;
  showPagination?: boolean;
};

const GTDataTableSearch = <T extends Record<string, unknown>>({
  toolbar,
  columns = [],
  data = [],
  filters,
  filterPredicate,
  pagination,
  onPaginationChange,
  showPagination = true,
}: GTDataTableProps<T>) => {
  return (
    <Table>
      <GTDataTableContent
        toolbar={toolbar}
        columns={columns}
        data={data}
        filters={filters}
        filterPredicate={filterPredicate}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        showPagination={showPagination}
      />
    </Table>
  );
};

export default GTDataTableSearch;

const GTDataTableContent = <T extends Record<string, unknown>>({
  toolbar,
  columns = [],
  data = [],
  filters,
  filterPredicate,
  pagination,
  onPaginationChange,
  showPagination = true,
}: GTDataTableProps<T>) => {
  const { state, dispatch } = useTableContext();
  const activePagination = pagination ?? state.pagination;
  const canUpdatePagination = Boolean(onPaginationChange) || !pagination;
  const updatePagination = (payload: { page: number; pageCount: number }) => {
    if (onPaginationChange) {
      onPaginationChange(payload);
    }

    if (!pagination) {
      dispatch({ type: ACTION_TYPES.SET_PAGINATION, pagination: payload });
    }
  };

  type DateRangeFilterValue = { start?: string; end?: string };

  const isDateRangeFilterValue = (
    value: unknown
  ): value is DateRangeFilterValue => {
    if (!value || typeof value !== 'object') {
      return false;
    }

    return 'start' in value || 'end' in value;
  };

  const isFilterEmpty = (value: unknown) => {
    if (value === null || value === undefined || value === '') {
      return true;
    }

    if (Array.isArray(value)) {
      return value.length === 0;
    }

    if (isDateRangeFilterValue(value)) {
      return !value.start && !value.end;
    }

    return false;
  };

  const parseDateValue = (value: unknown) => {
    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value;
    }

    if (typeof value === 'number') {
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    }

    if (typeof value === 'string') {
      if (value.trim() === '') {
        return null;
      }

      const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
      const date = new Date(isDateOnly ? `${value}T00:00:00` : value);
      return isNaN(date.getTime()) ? null : date;
    }

    return null;
  };

  const parseDateInput = (value: string | undefined, isEnd?: boolean) => {
    if (!value) {
      return null;
    }

    const suffix = isEnd ? 'T23:59:59.999' : 'T00:00:00';
    const date = new Date(`${value}${suffix}`);
    return isNaN(date.getTime()) ? null : date;
  };

  const defaultFilterPredicate = (
    row: T,
    nextFilters: Partial<Record<keyof T, unknown>>
  ) => {
    for (const [key, value] of Object.entries(nextFilters)) {
      if (isFilterEmpty(value)) {
        continue;
      }

      const rowValue = row[key as keyof T];

      if (isDateRangeFilterValue(value)) {
        const rowDate = parseDateValue(rowValue);

        if (!rowDate) {
          return false;
        }

        const startDate = parseDateInput(value.start);
        const endDate = parseDateInput(value.end, true);

        if (startDate && rowDate < startDate) {
          return false;
        }

        if (endDate && rowDate > endDate) {
          return false;
        }
      } else if (typeof value === 'string') {
        if (rowValue === null || rowValue === undefined) {
          return false;
        }

        if (!rowValue.toString().toLowerCase().includes(value.toLowerCase())) {
          return false;
        }
      } else if (Array.isArray(value)) {
        if (!value.includes(rowValue)) {
          return false;
        }
      } else if (rowValue !== value) {
        return false;
      }
    }

    return true;
  };

  const activeFilters =
    (filters ?? state.filters) as Partial<Record<keyof T, unknown>>;

  const filteredData = data.filter((row) => {
    if (!activeFilters || Object.keys(activeFilters).length === 0) {
      return true;
    }

    return filterPredicate
      ? filterPredicate(row, activeFilters)
      : defaultFilterPredicate(row, activeFilters);
  });

  const lastPageNumber = Math.max(1, Math.ceil(filteredData.length / activePagination.pageCount));
  const pageStart = (activePagination.page - 1) * activePagination.pageCount;
  const pageEnd = pageStart + activePagination.pageCount;
  const pagedData = filteredData.slice(pageStart, pageEnd);

  useEffect(() => {
    if (!canUpdatePagination) {
      return;
    }

    if (activePagination.page > lastPageNumber) {
      updatePagination({ ...activePagination, page: lastPageNumber });
    }
  }, [activePagination, canUpdatePagination, lastPageNumber]);

  useEffect(() => {
    if (filters === undefined) {
      return;
    }

    dispatch({ type: ACTION_TYPES.SET_FILTERS, filters });
  }, [dispatch, filters]);

  useEffect(() => {
    if (!canUpdatePagination || filters === undefined) {
      return;
    }

    if (activePagination.page !== 1) {
      updatePagination({ ...activePagination, page: 1 });
    }
  }, [activePagination, canUpdatePagination, filters]);

  return (
    <>
      <Table.Toolbar>{toolbar}</Table.Toolbar>
      <Table.Container columns={columns as ColumnProps[]}>
        <Table.Header>
          {columns.map((column, i) => (
            <Table.ColumnHeader key={i} column={column as ColumnProps}>
              {column.header}
            </Table.ColumnHeader>
          ))}
        </Table.Header>
        <Table.Body>
          {useRenderRows(pagedData, columns).map((entry, i) => (
            <Table.Row key={i} cellData={entry.row}>
              {entry.columns.map((column, i) => (
                <Table.Cell key={i}>{column.renderComponent}</Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Container>
      {showPagination && (
        <Table.ToolbarPagination>
          <GTRowCountDropdown
            pageCount={activePagination.pageCount}
            onChange={({ pageCount }) => updatePagination({ page: 1, pageCount })}
          />
          <GTPagination
            payload={activePagination}
            count={filteredData.length}
            onChange={(payload) => updatePagination(payload)}
          />
        </Table.ToolbarPagination>
      )}
    </>
  );
};
