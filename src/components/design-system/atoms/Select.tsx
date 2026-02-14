import type { SelectHTMLAttributes } from 'react';

import { cx } from '../utils';

type SelectSize = 'sm' | 'md' | 'lg';

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
  uiSize?: SelectSize;
  hasError?: boolean;
};

const baseClasses =
  'w-full rounded-[--radius-lg] border bg-[--surface] px-3 text-sm text-[--ink] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--focus-ring] focus-visible:ring-offset-2 focus-visible:ring-offset-[--surface] disabled:cursor-not-allowed disabled:opacity-60';

const sizeClasses: Record<SelectSize, string> = {
  sm: 'h-9',
  md: 'h-11',
  lg: 'h-12 text-base',
};

export const Select = ({
  uiSize = 'md',
  hasError,
  className,
  ...props
}: SelectProps) => (
  <select
    className={cx(
      baseClasses,
      sizeClasses[uiSize],
      hasError && 'border-[--danger] focus-visible:ring-[rgba(194,65,12,0.35)]',
      className
    )}
    {...props}
  />
);
