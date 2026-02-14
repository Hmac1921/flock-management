import type { HTMLAttributes, ReactNode } from 'react';

import { cx } from '../utils';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  title?: ReactNode;
  eyebrow?: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
};

export const Card = ({
  title,
  eyebrow,
  action,
  footer,
  className,
  children,
  ...props
}: CardProps) => (
  <div
    className={cx(
      'surface-gradient rounded-[--radius-lg] border border-[--border] bg-[--surface] p-6 shadow-[--shadow-card]',
      className
    )}
    {...props}
  >
    {(title || eyebrow || action) && (
      <div className="flex items-start justify-between gap-4">
        <div>
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[--ink-muted]">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h3 className="font-display text-xl font-semibold text-[--ink]">
              {title}
            </h3>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    )}
    {children ? <div className="mt-4">{children}</div> : null}
    {footer ? <div className="mt-4 border-t border-[--border] pt-4">{footer}</div> : null}
  </div>
);
