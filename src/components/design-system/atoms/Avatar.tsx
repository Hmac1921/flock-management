import type { ImgHTMLAttributes } from 'react';

import { cx } from '../utils';

export type AvatarProps = ImgHTMLAttributes<HTMLImageElement> & {
  name: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join('');

export const Avatar = ({ name, size = 'md', className, ...props }: AvatarProps) => {
  const initials = getInitials(name);

  if (props.src) {
    return (
      <img
        alt={name}
        className={cx(
          'rounded-full object-cover ring-2 ring-[--surface] shadow-sm',
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }

  return (
    <div
      className={cx(
        'flex items-center justify-center rounded-full bg-[--surface-muted] font-semibold text-[--ink]',
        sizeClasses[size],
        className
      )}
      aria-label={name}
      role="img"
    >
      {initials}
    </div>
  );
};
