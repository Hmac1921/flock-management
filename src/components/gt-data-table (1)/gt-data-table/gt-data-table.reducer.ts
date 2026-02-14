import { type ColumnProps } from "./gt-data-table-types";

const ACTION_TYPES = Object.freeze({
  INIT: "init",
  RESIZE_COLUMN: "resize-column",
  SET_PAGINATION: "set-pagination",
  SET_SORT: "set-sort",
  SET_FILTERS: "set-filters",
  RESET_FILTERS: "reset-filters",
});

export type TableAction =
  | { type: "init"; columns: ColumnProps<Record<string, unknown>>[] }
  | { type: "resize-column"; value: string; field: string }
  | { type: "set-pagination"; pagination: PaginationState }
  | { type: "set-sort"; sort: SortState }
  | { type: "set-filters"; filters: Partial<Record<string, unknown>> }
  | { type: "reset-filters" };

type IndexedTableProps = {
  field: string;
  header: string;
  cell?: string;
  flex?: number;
  index: number;
};

type PaginationState = {
  page: number;
  pageCount: number;
};

type SortState = {
  sortColumn: string;
  sortOrder: "asc" | "desc";
};

export type TableState = {
  columns: ColumnProps<Record<string, unknown>>[];
  gridTemplateColumns: Array<string>;
  currentGridSizes: string;
  pagination: PaginationState;
  sort: SortState;
  filters: Partial<Record<string, unknown>>;
};

const initialArg: TableState = {
  columns: [],
  gridTemplateColumns: [],
  currentGridSizes: "",
  pagination: { page: 1, pageCount: 15 },
  sort: { sortColumn: "", sortOrder: "asc" },
  filters: {},
};

const reducer = (state: TableState, action: TableAction) => {
  switch (action.type) {
    case ACTION_TYPES.INIT: {
      const arr: string[] = [];
      const indexed: IndexedTableProps[] = [];

      action.columns.forEach((item, i) => {
        if (item.flex) {
          arr.push(` ${item.flex}fr`);
        } else {
          arr.push(" 1fr");
        }

        indexed.push({
          ...item,
          index: i,
        });
      });

      return {
        ...state,
        columns: indexed,
        gridTemplateColumns: arr,
        currentGridSizes: arr.join(" "),
      };
    }

    case ACTION_TYPES.RESIZE_COLUMN: {
      const arr: string[] = [];

      state.columns.forEach((item) => {
        if (item.field === action.field) {
          arr.push(` ${action.value}`);
        } else {
          arr.push(" 1fr");
        }
      });

      return {
        ...state,
        gridTemplateColumns: arr,
        currentGridSizes: arr.join(" "),
      };
    }

    case ACTION_TYPES.SET_PAGINATION:
      return {
        ...state,
        pagination: action.pagination,
      };

    case ACTION_TYPES.SET_SORT:
      return {
        ...state,
        sort: action.sort,
      };

    case ACTION_TYPES.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.filters },
      };

    case ACTION_TYPES.RESET_FILTERS:
      return {
        ...state,
        filters: {},
        pagination: { ...state.pagination, page: 1 },
      };

    default:
      return state;
  }
};

export { reducer, initialArg, ACTION_TYPES };
