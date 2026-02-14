import type { ReactNode } from 'react';

import { Button } from '../atoms/Button';
import { cx } from '../utils';

export type EmptyStateProps = {
  title: ReactNode;
  description?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  className?: string;
};

export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
}: EmptyStateProps) => (
  <div
    className={cx(
      'surface-muted-gradient flex flex-col items-start gap-3 rounded-[--radius-lg] border border-dashed border-[--border] bg-[--surface-muted] p-6',
      className
    )}
  >
    {icon ? <div className="text-2xl text-[--accent]">{icon}</div> : null}
    <div>
      <h4 className="font-display text-lg font-semibold text-[--ink]">{title}</h4>
      {description ? (
        <p className="mt-1 text-sm text-[--ink-muted]">{description}</p>
      ) : null}
    </div>
    {actionLabel ? (
      <Button variant="secondary" onClick={onAction}>
        {actionLabel}
      </Button>
    ) : null}
  </div>
);
