import type { TextareaHTMLAttributes } from 'react';

import { cx } from '../utils';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasError?: boolean;
};

const baseClasses =
  'min-h-[120px] w-full rounded-[--radius-lg] border bg-[--surface] px-3 py-2 text-sm text-[--ink] placeholder:text-[--ink-muted] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--focus-ring] focus-visible:ring-offset-2 focus-visible:ring-offset-[--surface] disabled:cursor-not-allowed disabled:opacity-60';

export const Textarea = ({ hasError, className, ...props }: TextareaProps) => (
  <textarea
    className={cx(
      baseClasses,
      hasError && 'border-[--danger] focus-visible:ring-[rgba(194,65,12,0.35)]',
      className
    )}
    {...props}
  />
);
