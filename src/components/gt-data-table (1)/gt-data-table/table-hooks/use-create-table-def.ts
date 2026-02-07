import { ReactNode } from 'react';
import { individualTranslation } from '../../../../helpers/translations-helper';

type TableDataProps<T extends Record<string, unknown> = Record<string, unknown>> = {
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
}: TableDataProps<T>) => {
  const def = {
    field: field,
    header: header ? individualTranslation(header) : '',
    cell: cell ?? 'default',
    flex: flex ?? 1,
    renderComponent: customComponent ?? null,
    isVisible: isVisible ?? true
  };

  return def;
};

export default useCreateTableDef;
