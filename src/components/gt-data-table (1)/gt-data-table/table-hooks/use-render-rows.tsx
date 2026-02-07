import { type ColumnProps } from "../gt-data-table-types";

import type { ReactNode } from "react";

type RowObjectProps<T extends Record<string, unknown>> = {
  row: T;
  columns: TableDataProps<T>[];
};
type TableDataProps<T extends Record<string, unknown>> = {
  field: keyof T & string;
  header: string;
  cell?: string;
  flex?: number;
  renderComponent?: ReactNode;
};
const cellTypeConsts = {
  LINK_TEXT: "link-text",
  TEXT: "text",
  LINK_DATE: "link-date",
  DATE: "date",
  CUSTOM: "custom",
};

const useRenderRows = <T extends Record<string, unknown>>(
  data: T[],
  columns: ColumnProps<T>[]
) => {
  const arr: RowObjectProps<T>[] = [];

  data.forEach((item: T) => {
    const internalArr: TableDataProps<T>[] = [];

    columns.forEach((col: ColumnProps<T>) => {
      const renderCellContents = (value: unknown) => {
        if (!value) {
          return " - ";
        } else {
          return value.toString();
        }
      };
      const renderCellType = () => {
        switch (col.cell) {
          case cellTypeConsts.LINK_TEXT:
            const linkTarget = (item as Record<string, unknown>).id ?? "";
            return (
              <a href={`${window.location.href}/${linkTarget}`}>
                {renderCellContents(item[col.field as keyof T])}
              </a>
            );

          default:
            <></>;
        }
      };

      internalArr.push({
        ...col,
        renderComponent: renderCellType(),
      });
    });

    arr.push({ row: item, columns: internalArr });
  });

  return arr;
};

export default useRenderRows;
