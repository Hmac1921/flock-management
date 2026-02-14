import type { HTMLAttributes } from 'react';

import { cx } from '../utils';

export type DividerProps = HTMLAttributes<HTMLHRElement>;

export const Divider = ({ className, ...props }: DividerProps) => (
  <hr className={cx('border-[--border]', className)} {...props} />
);
