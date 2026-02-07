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
import { ACTION_TYPES, initialArg, reducer } from "./gt-data-table-settings.reducer";
import type { TableAction, TableState } from "./gt-data-table-settings.reducer";

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
      <div className=" m-4 flex flex-col p-4 bg-(--muidefaults-background-paper-elevation-1) text-(--text-primary) overflow-x-hidden ">
        {children}
      </div>
    </DataTableContext.Provider>
  );
};

type ToolbarProps = {
  children: ReactNode;
};

const Toolbar = ({ children }: ToolbarProps) => {
  return <div className="flex justify-between pb-4 pt-2 py-1">{children}</div>;
};

type ToolbarPaginationProps = {
  children: ReactNode;
};

const ToolbarPagination = ({ children }: ToolbarPaginationProps) => {
  return (
    <div className="flex items-center justify-end gap-4 p-2">{children}</div>
  );
};

type ContainerProps = {
  children: ReactNode;
  columns: ColumnProps[];
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
    <table ref={tableRef} id="table" className="grid">
      {children}
    </table>
  );
};

type HeaderProps = {
  children: ReactNode;
};

const Header = ({ children }: HeaderProps) => {
  return (
    <thead className=" contents">
      <tr className="contents  ">{children}</tr>
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
  column: ColumnProps;
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
        <th className=" relative text-left  pl-2 border-b">
          {children}

          <div
            className="bg-transparent absolute top-0 right-0 h-full w-1.5 hover:bg-(--text-primary)"
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
      className="contents "
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
    <td className="  p-1.5 border-t border-collapse ">
      <span className=" pl-2 block overflow-hidden overflow-ellipsis whitespace-nowrap">
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
