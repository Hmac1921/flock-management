import {type  Dispatch } from "react";

import { ACTION_TYPES, type TableAction } from "./gt-data-table.reducer";

const setPagination = (
  pagination: { page: number; pageCount: number },
  dispatch: Dispatch<TableAction>
) => {
  dispatch({ type: ACTION_TYPES.SET_PAGINATION, pagination });
};

const setSort = (
  sort: { sortColumn: string; sortOrder: "asc" | "desc" },
  dispatch: Dispatch<TableAction>
) => {
  dispatch({ type: ACTION_TYPES.SET_SORT, sort });
};

const setFilters = (
  filters: Record<string, unknown>,
  dispatch: Dispatch<TableAction>
) => {
  dispatch({ type: ACTION_TYPES.SET_FILTERS, filters });
};

const resetFilters = (dispatch: Dispatch<TableAction>) => {
  dispatch({ type: ACTION_TYPES.RESET_FILTERS });
};

export { setPagination, setSort, setFilters, resetFilters };
