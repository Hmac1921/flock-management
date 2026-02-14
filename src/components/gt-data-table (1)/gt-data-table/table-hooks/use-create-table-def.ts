import type { ReactNode } from 'react';
import type { ColumnProps } from '../gt-data-table-types';

export type TableDataProps<T extends Record<string, unknown> = Record<string, unknown>> = {
  field: keyof T & string;
  header?: string;
  cell?: string;
  flex?: number;
  customComponent?: ReactNode;
  isVisible?:boolean | string 
};

const useCreateTableDef = <T extends Record<string, unknown>>({
  field,
  header,
  cell,
  flex,
  customComponent,
  isVisible,
}: TableDataProps<T>): ColumnProps<T> & { isVisible: boolean | string } => {
  return {
    field: field,
    header: header ?? '',
    cell: cell ?? 'default',
    flex: flex ?? 1,
    renderComponent: customComponent ?? null,
    isVisible: isVisible ?? true
  };
};

export default useCreateTableDef;
