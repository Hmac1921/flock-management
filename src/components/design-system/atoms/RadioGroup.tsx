import { useId } from 'react';

import { cx } from '../utils';

export type RadioOption = {
  label: string;
  value: string;
};

export type RadioGroupProps = {
  name: string;
  label?: string;
  value?: string;
  options: RadioOption[];
  onChange?: (value: string) => void;
  className?: string;
};

export const RadioGroup = ({
  name,
  label,
  value,
  options,
  onChange,
  className,
}: RadioGroupProps) => {
  const groupId = useId();

  return (
    <fieldset className={cx('flex flex-col gap-2', className)}>
      {label ? (
        <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-[--ink-muted]">
          {label}
        </legend>
      ) : null}
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const id = `${groupId}-${option.value}`;
          return (
            <label
              key={option.value}
              htmlFor={id}
              className={cx(
                'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition',
                value === option.value
                  ? 'border-[--brand] bg-[--brand-soft] text-[--brand-strong]'
                  : 'border-[--border] bg-[--surface]'
              )}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange?.(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};
