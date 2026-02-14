import type { ButtonHTMLAttributes } from 'react';

import { cx } from '../utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-[--radius-lg] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--focus-ring] focus-visible:ring-offset-2 focus-visible:ring-offset-[--surface] disabled:cursor-not-allowed disabled:opacity-60';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[--brand] text-[--on-brand] shadow-[--shadow-button] hover:bg-[--brand-strong]',
  secondary:
    'border border-[--border] bg-[--surface] text-[--ink] hover:bg-[--surface-muted]',
  ghost: 'text-[--ink] hover:bg-[--surface-muted]',
  danger: 'bg-[--danger] text-white hover:brightness-95',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  type = 'button',
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={cx(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      className
    )}
    {...props}
  />
);
