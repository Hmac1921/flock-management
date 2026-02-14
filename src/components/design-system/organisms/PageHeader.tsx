import type { ReactNode } from 'react';

import { cx } from '../utils';

export type PageHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export const PageHeader = ({ title, subtitle, actions, className }: PageHeaderProps) => (
  <div className={cx('flex flex-wrap items-center justify-between gap-4', className)}>
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[--ink-muted]">
        Flock Management
      </p>
      <h1 className="font-display text-2xl font-semibold text-[--ink]">{title}</h1>
      {subtitle ? (
        <p className="mt-1 text-sm text-[--ink-muted]">{subtitle}</p>
      ) : null}
    </div>
    {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
  </div>
);
