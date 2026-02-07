import { type ColumnProps } from "./gt-data-table-types";

const ACTION_TYPES = Object.freeze({
  INIT: "init",
  RESIZE_COLUMN: "resize-column",
});

export type TableAction =
  | { type: "init"; columns: ColumnProps[] }
  | { type: "resize-column"; value: string; field: string };

type IndexedTableProps = {
  field: string;
  header: string;
  cell?: string;
  flex?: number;
  index: number;
};

export type TableState = {
  columns: ColumnProps[];
  gridTemplateColumns: Array<string>;
  currentGridSizes: string;
};

const initialArg: TableState = {
  columns: [],
  gridTemplateColumns: [],
  currentGridSizes: "",
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

    default:
      return state;
  }
};

export { reducer, initialArg, ACTION_TYPES };
