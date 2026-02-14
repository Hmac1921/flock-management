import {
  createContext,
  type ReactNode,
  type Ref,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";

import type { ColumnProps } from "./gt-data-table-types";
import { GTDataTableResizer } from "./gt-data-table-resizer";
import { ACTION_TYPES, initialArg, reducer } from "./gt-data-table.reducer";
import type { TableAction, TableState } from "./gt-data-table.reducer";

type TableDispatch = (action: TableAction) => void;

type TableContext = {
  state: TableState;
  dispatch: TableDispatch;
};

const DataTableContext = createContext<TableContext>({
  state: {
    columns: [],
    gridTemplateColumns: [],
    currentGridSizes: "",
    pagination: { page: 1, pageCount: 15 },
    sort: { sortColumn: "", sortOrder: "asc" },
    filters: {},
  },
  dispatch: () => {},
});

type TableProps = {
  children: ReactNode;
};

export const Table = ({ children }: TableProps) => {
  const [state, dispatch] = useReducer(reducer, initialArg);

  return (
    <DataTableContext.Provider value={{ state, dispatch }}>
      <div className="surface-gradient m-4 flex flex-col overflow-x-hidden rounded-[--radius-lg] border border-border/30
       bg-[--surface] p-4 text-[--ink] shadow-[--shadow-card]">
        {children}
      </div>
    </DataTableContext.Provider>
  );
};

export const useTableContext = () => useContext(DataTableContext);

type ToolbarProps = {
  children: ReactNode;
};

const Toolbar = ({ children }: ToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 pt-2">
      {children}
    </div>
  );
};

type ToolbarPaginationProps = {
  children: ReactNode;
};

const ToolbarPagination = ({ children }: ToolbarPaginationProps) => {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-end gap-4 border-t border-border pt-3">
      {children}
    </div>
  );
};

type ContainerProps = {
  children: ReactNode;
  columns: ColumnProps<Record<string, unknown>>[];
};

const Container = ({ children, columns }: ContainerProps) => {
  const { state, dispatch } = useContext(DataTableContext);
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.style.gridTemplateColumns = state.currentGridSizes;
    }
  }, [state.currentGridSizes]);

  useEffect(() => {
    dispatch({ type: ACTION_TYPES.INIT, columns: columns });
  }, [columns, dispatch]);

  return (
    <table ref={tableRef} id="table" className="grid w-full">
      {children}
    </table>
  );
};

type HeaderProps = {
  children: ReactNode;
};

const Header = ({ children }: HeaderProps) => {
  return (
    <thead className="contents">
      <tr className="contents text-xs font-semibold uppercase tracking-[0.2em] text-[--ink-muted]">
        {children}
      </tr>
    </thead>
  );
};

type ColumnSortingProps = {
  onClick: (value: Record<string, string>) => void;
  header: string;
  currentSorting: {
    sortColumn: string;
    sortOrder: string;
  };
};

const ColumnSorting = ({
  onClick,
  header,
  currentSorting,
}: ColumnSortingProps) => {
  const css = {
    active: "absolute block right-4 bottom-1",
    inactive: "absolute right-4 bottom-1 opacity-0 hover:opacity-100  ",
  };

  const handleChangeSorting = (header: string) => {
    if (currentSorting.sortOrder === "desc") {
      onClick({
        sortColumn: header,
        sortOrder: "asc",
      });
    } else if (currentSorting.sortOrder === "asc") {
      onClick({
        sortColumn: header,
        sortOrder: "desc",
      });
    }
  };

  return (
    <div
      className={
        currentSorting.sortColumn === header ? css.active : css.inactive
      }
      onClick={() => handleChangeSorting(header)}
    >
      {currentSorting.sortOrder === "asc" ? "^" : ">"}
    </div>
  );
};

type ColumnHeaderProps = {
  children: ReactNode;
  column: ColumnProps<Record<string, unknown>>;
};

const ColumnHeader = ({ children, column }: ColumnHeaderProps) => {
  const { dispatch } = useContext(DataTableContext);

  return (
    <GTDataTableResizer
      onResizeHandler={(value) =>
        dispatch({
          type: ACTION_TYPES.RESIZE_COLUMN,
          value: value,
          field: column.field,
        })
      }
    >
      {({ ref }: { ref: Ref<HTMLDivElement> }) => (
        <th className="surface-muted-gradient relative border-b border-[--border] bg-[--surface-muted] px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[--ink-muted]">
          {children}

          <div
            className="absolute right-0 top-0 h-full w-1.5 bg-transparent hover:bg-[--brand-soft]"
            ref={ref}
          ></div>
        </th>
      )}
    </GTDataTableResizer>
  );
};

type BodyProps = {
  children: ReactNode;
};

const Body = ({ children }: BodyProps) => {
  return <tbody className="contents">{children}</tbody>;
};

type RowProps = {
  children: ReactNode;
  cellData: object;
  onClick?: (row: object) => void;
};

const Row = ({ children, onClick, cellData }: RowProps) => {
  return (
    <tr
      // onMouseOver={() => state.onHover && state.onHover(state.row)} TODO
      onClick={() => onClick && cellData && onClick(cellData)}
      className="contents group"
    >
      {children}
    </tr>
  );
};

type CellProps = {
  children: ReactNode;
};

const Cell = ({ children }: CellProps) => {
  return (
    <td className="border-t border-[--border] px-3 py-2 text-sm text-[--ink] transition group-hover:bg-[--surface-muted]">
      <span className="block overflow-hidden overflow-ellipsis whitespace-nowrap">
        {" "}
        {children}
      </span>
    </td>
  );
};

Table.Toolbar = Toolbar;
Table.ToolbarPagination = ToolbarPagination;
Table.Container = Container;
Table.Header = Header;
Table.ColumnHeader = ColumnHeader;
Table.ColumnSorting = ColumnSorting;
Table.Body = Body;
Table.Row = Row;
Table.Cell = Cell;
