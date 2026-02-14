import type { ReactNode } from 'react';

import { Card } from './Card';

export type StatCardProps = {
  label: ReactNode;
  value: ReactNode;
  trend?: ReactNode;
  footnote?: ReactNode;
};

export const StatCard = ({ label, value, trend, footnote }: StatCardProps) => (
  <Card>
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[--ink-muted]">
          {label}
        </p>
        <p className="font-display text-2xl font-semibold text-[--ink]">{value}</p>
      </div>
      {trend ? (
        <div className="rounded-full bg-[--brand-soft] px-3 py-1 text-xs font-semibold text-[--brand-strong]">
          {trend}
        </div>
      ) : null}
    </div>
    {footnote ? <p className="mt-3 text-xs text-[--ink-muted]">{footnote}</p> : null}
  </Card>
);
