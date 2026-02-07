import { ReactNode } from 'react';

export type ColumnProps<T extends Record<string, unknown> = Record<string, unknown>> = {
  field: keyof T & string;
  header: string;
  cell?: string;
  flex?: number;
  renderComponent?: ReactNode;
};

export type ColumnHeaderProps = {
  children: ReactNode;
  flex?: number;
};

export type ListResponse = {
  data: {
    list: Record<string, unknown>[];
    count: number;
  };
};
