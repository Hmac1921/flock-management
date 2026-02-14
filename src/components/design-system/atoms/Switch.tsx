import type { ButtonHTMLAttributes } from 'react';

import { cx } from '../utils';

export type SwitchProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  checked?: boolean;
  label?: string;
};

export const Switch = ({
  checked = false,
  label,
  className,
  ...props
}: SwitchProps) => (
  <label className="inline-flex items-center gap-3 text-sm text-[--ink]">
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cx(
        'relative h-6 w-11 rounded-full border border-[--border] transition',
        checked ? 'bg-[--brand]' : 'bg-[--surface-muted]',
        className
      )}
      {...props}
    >
      <span
        className={cx(
          'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition',
          checked && 'translate-x-5'
        )}
      />
    </button>
    {label ? <span>{label}</span> : null}
  </label>
);
