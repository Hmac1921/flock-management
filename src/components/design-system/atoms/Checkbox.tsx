import type { InputHTMLAttributes } from 'react';

import { cx } from '../utils';

export type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Checkbox = ({ label, className, ...props }: CheckboxProps) => (
  <label className="inline-flex items-center gap-2 text-sm text-[--ink]">
    <input
      type="checkbox"
      className={cx(
        'h-4 w-4 rounded-[--radius-sm] border border-[--border] text-[--brand] focus-visible:ring-2 focus-visible:ring-[--focus-ring]',
        className
      )}
      {...props}
    />
    {label ? <span>{label}</span> : null}
  </label>
);
