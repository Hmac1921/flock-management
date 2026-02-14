import type { HTMLAttributes } from 'react';

import { cx } from '../utils';

type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'accent';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-[--surface-muted] text-[--ink]',
  success: 'bg-[rgba(21,128,61,0.15)] text-[--success]',
  warning: 'bg-[rgba(180,83,9,0.15)] text-[--warning]',
  danger: 'bg-[rgba(194,65,12,0.15)] text-[--danger]',
  accent: 'bg-[rgba(204,122,45,0.15)] text-[--accent]',
};

export const Badge = ({
  variant = 'neutral',
  className,
  ...props
}: BadgeProps) => (
  <span
    className={cx(
      'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]',
      variantClasses[variant],
      className
    )}
    {...props}
  />
);
