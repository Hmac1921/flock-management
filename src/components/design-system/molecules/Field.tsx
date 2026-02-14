import { type ReactNode, useId } from 'react';

import { cx } from '../utils';

export type FieldProps = {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  className?: string;
  children: (id: string) => ReactNode;
};

export const Field = ({
  label,
  helperText,
  error,
  className,
  children,
}: FieldProps) => {
  const id = useId();
  const helperId = helperText ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={cx('flex flex-col gap-2', className)}>
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-[--ink]">
          {label}
        </label>
      ) : null}
      {children(id)}
      {helperText ? (
        <p id={helperId} className="text-xs text-[--ink-muted]">
          {helperText}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs font-semibold text-[--danger]">
          {error}
        </p>
      ) : null}
    </div>
  );
};
