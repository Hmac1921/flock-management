import { type ReactNode, useEffect, useState } from 'react';

import { Table } from './gt-data-table-context';
import useRenderRows from './table-hooks/use-render-rows';

import type { ColumnProps } from './gt-data-table-types';
import GTPagination from './table-components/gt-pagination';
import GTRowCountDropdown from './table-components/gt-row-count-dropdown';


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
  filters = {},
  filterPredicate,
  pagination,
  onPaginationChange,
  showPagination = true,
}: GTDataTableProps<T>) => {
  // const [state, dispatch] = useReducer<Reducer<TableState, TableAction>>(reducer, initialArg);

  // useEffect(() => {
  //   if (state.filterPayload) {
  //     let obj = {};

  //     for (const key in filterPayload) {
  //       if (filterPayload[key]) {
  //         obj = { ...obj, [key]: filterPayload[key] };
  //       }
  //     }

  //     loadFiltered(endpoint, tableSettingsPayload, obj, dispatch);
  //   }
  // }, [filterPayload]);


  const [internalPagination, setInternalPagination] = useState({
    page: 1,
    pageCount: 15,
  });
  const activePagination = pagination ?? internalPagination;

  const canUpdatePagination = Boolean(onPaginationChange) || !pagination;
  const updatePagination = (payload: { page: number; pageCount: number }) => {
    if (onPaginationChange) {
      onPaginationChange(payload);
    }

    if (!pagination) {
      setInternalPagination(payload);
    }
  };

  const isFilterEmpty = (value: unknown) => {
    if (value === null || value === undefined || value === '') {
      return true;
    }

    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return false;
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

      if (typeof value === 'string') {
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

  const filteredData = data.filter((row) => {
    if (!filters || Object.keys(filters).length === 0) {
      return true;
    }

    return filterPredicate ? filterPredicate(row, filters) : defaultFilterPredicate(row, filters);
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
    if (!canUpdatePagination || !filters) {
      return;
    }

    if (activePagination.page !== 1) {
      updatePagination({ ...activePagination, page: 1 });
    }
  }, [canUpdatePagination, filters]);

  return (
    <Table>
      <Table.Toolbar>
        {toolbar}
    
      </Table.Toolbar>
      <Table.Container columns={columns}>
        <Table.Header>
          {columns.map((column, i) => (
            <Table.ColumnHeader key={i} column={column}>
              {column.header}
              {/* <Table.ColumnSorting
                currentSorting={state.pagePayload}
                header={column.field}
                onClick={(value) =>
                  changePage(endpoint, { ...tableSettingsPayload, ...value }, filterPayload, dispatch)
                }
              /> */}
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
    </Table>
  );
};

export default GTDataTableSearch;
