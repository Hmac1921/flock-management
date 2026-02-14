import { type ChangeEvent, type ReactNode, useId } from 'react';

import { ACTION_TYPES } from '../../gt-data-table.reducer';
import { useTableContext } from '../../gt-data-table-context';
import { cx } from '../../../../design-system/utils';

export type FilterOption = {
  label: string;
  value: string | number;
};

export type DateRangeFilterValue = {
  start?: string;
  end?: string;
};

type BaseFilterProps<TValue> = {
  field: string;
  label?: ReactNode;
  value?: TValue;
  onChange?: (value: TValue) => void;
  className?: string;
  disabled?: boolean;
};

const useFilterValue = <TValue,>(
  field: string,
  value: TValue | undefined,
  onChange: ((value: TValue) => void) | undefined
) => {
  const { state, dispatch } = useTableContext();
  const isControlled = value !== undefined;
  const activeValue = isControlled
    ? value
    : (state.filters?.[field] as TValue | undefined);

  const setValue = (nextValue: TValue) => {
    if (onChange) {
      onChange(nextValue);
    }

    if (!isControlled) {
      dispatch({
        type: ACTION_TYPES.SET_FILTERS,
        filters: { [field]: nextValue },
      });
    }
  };

  return { value: activeValue, setValue };
};

const resolveSelectValue = (
  rawValue: string,
  options: FilterOption[]
) => {
  const match = options.find((option) => String(option.value) === rawValue);
  if (!match) {
    return rawValue;
  }

  return match.value;
};

export const GTFilterText = ({
  field,
  label,
  value,
  onChange,
  className,
  disabled,
  placeholder = 'Search',
}: BaseFilterProps<string> & { placeholder?: string }) => {
  const { value: activeValue, setValue } = useFilterValue<string>(
    field,
    value,
    onChange
  );

  return (
    <div className={`flex flex-col gap-1 ${className ?? ''}`}>
      {label ? (
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[--ink-muted]">
          {label}
        </span>
      ) : null}
      <input
        type="text"
        className="h-9 rounded-[--radius-lg] border border-[--border] bg-[--surface] px-3 text-sm text-[--ink] placeholder:text-[--ink-muted] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--focus-ring]"
        value={activeValue ?? ''}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setValue(event.target.value)
        }
      />
    </div>
  );
};

export const GTFilterSelect = ({
  field,
  label,
  value,
  onChange,
  className,
  disabled,
  options,
  includeEmptyOption = true,
  emptyLabel = 'All',
}: BaseFilterProps<string | number> & {
  options: FilterOption[];
  includeEmptyOption?: boolean;
  emptyLabel?: string;
}) => {
  const { value: activeValue, setValue } = useFilterValue<string | number>(
    field,
    value,
    onChange
  );

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextValue = resolveSelectValue(event.target.value, options);
    setValue(nextValue);
  };

  return (
    <div className={`flex flex-col gap-1 ${className ?? ''}`}>
      {label ? (
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[--ink-muted]">
          {label}
        </span>
      ) : null}
      <select
        className="h-9 rounded-[--radius-lg] border border-[--border] bg-[--surface] px-3 text-sm text-[--ink] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--focus-ring]"
        value={activeValue ?? ''}
        disabled={disabled}
        onChange={handleChange}
      >
        {includeEmptyOption ? (
          <option value="">{emptyLabel}</option>
        ) : null}
        {options.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const GTFilterDate = ({
  field,
  label,
  value,
  onChange,
  className,
  disabled,
}: BaseFilterProps<string>) => {
  const { value: activeValue, setValue } = useFilterValue<string>(
    field,
    value,
    onChange
  );

  return (
    <div className={`flex flex-col gap-1 ${className ?? ''}`}>
      {label ? (
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[--ink-muted]">
          {label}
        </span>
      ) : null}
      <input
        type="date"
        className="h-9 rounded-[--radius-lg] border border-[--border] bg-[--surface] px-3 text-sm text-[--ink] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--focus-ring]"
        value={activeValue ?? ''}
        disabled={disabled}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setValue(event.target.value)
        }
      />
    </div>
  );
};

export const GTFilterDateRange = ({
  field,
  label,
  value,
  onChange,
  className,
  disabled,
  startLabel = 'From',
  endLabel = 'To',
}: BaseFilterProps<DateRangeFilterValue> & {
  startLabel?: ReactNode;
  endLabel?: ReactNode;
}) => {
  const { value: activeValue, setValue } = useFilterValue<DateRangeFilterValue>(
    field,
    value,
    onChange
  );

  const currentValue = activeValue ?? { start: '', end: '' };

  const handleStartChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue({ ...currentValue, start: event.target.value });
  };

  const handleEndChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue({ ...currentValue, end: event.target.value });
  };

  return (
    <div className={`flex flex-col gap-1 ${className ?? ''}`}>
      {label ? (
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[--ink-muted]">
          {label}
        </span>
      ) : null}
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-xs font-medium text-[--ink-muted]">
          {startLabel}
          <input
            type="date"
            className="h-9 rounded-[--radius-lg] border border-[--border] bg-[--surface] px-3 text-sm text-[--ink] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--focus-ring]"
            value={currentValue.start ?? ''}
            disabled={disabled}
            onChange={handleStartChange}
          />
        </label>
        <label className="flex items-center gap-2 text-xs font-medium text-[--ink-muted]">
          {endLabel}
          <input
            type="date"
            className="h-9 rounded-[--radius-lg] border border-[--border] bg-[--surface] px-3 text-sm text-[--ink] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--focus-ring]"
            value={currentValue.end ?? ''}
            disabled={disabled}
            onChange={handleEndChange}
          />
        </label>
      </div>
    </div>
  );
};

export const GTFilterRadioGroup = ({
  field,
  label,
  value,
  onChange,
  className,
  disabled,
  options,
}: BaseFilterProps<string | number> & { options: FilterOption[] }) => {
  const { value: activeValue, setValue } = useFilterValue<string | number>(
    field,
    value,
    onChange
  );
  const groupId = useId();

  return (
    <fieldset
      className={`flex flex-col gap-1 ${className ?? ''}`}
      disabled={disabled}
    >
      {label ? (
        <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-[--ink-muted]">
          {label}
        </legend>
      ) : null}
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const id = `${groupId}-${String(option.value)}`;
          return (
            <label
              key={String(option.value)}
              htmlFor={id}
              className="flex items-center gap-2 rounded-full border border-[--border] bg-[--surface] px-3 py-1.5 text-sm text-[--ink] transition hover:bg-[--surface-muted]"
            >
              <input
                id={id}
                type="radio"
                name={field}
                value={String(option.value)}
                checked={activeValue === option.value}
                onChange={() => setValue(option.value)}
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};

export const GTFilterClear = ({
  label = 'Clear filters',
  className,
}: {
  label?: ReactNode;
  className?: string;
}) => {
  const { dispatch } = useTableContext();

  return (
    <button
      type="button"
      className={cx(
        'h-9 rounded-[--radius-lg] border border-[--border] bg-[--surface] px-3 text-xs font-semibold uppercase tracking-[0.18em] text-[--ink] transition hover:bg-[--surface-muted]',
        className
      )}
      onClick={() => dispatch({ type: ACTION_TYPES.RESET_FILTERS })}
    >
      {label}
    </button>
  );
};
