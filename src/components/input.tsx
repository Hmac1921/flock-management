import { type ChangeEvent, type ReactNode, useId, useState } from "react";

type ModernInputProps = {
  label?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  onDisabledChange?: (next: boolean) => void;
  showDisabledToggle?: boolean;
  error?: string;
  helperText?: string;
  id?: string;
  name?: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  className?: string;
};

const Input = ({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  onDisabledChange,
  showDisabledToggle = true,
  error,
  helperText,
  id,
  name,
  type = "text",
  autoComplete,
  required,
  leadingIcon,
  trailingIcon,
  className = "",
}: ModernInputProps) => {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  const [internalDisabled, setInternalDisabled] = useState(false);
  const isDisabled = disabled ?? internalDisabled;
  const hasError = Boolean(error);

  const handleToggle = () => {
    const next = !isDisabled;
    onDisabledChange?.(next);
    if (disabled === undefined) {
      setInternalDisabled(next);
    }
  };

  return (
    <div className={`w-full max-w-xl ${className}`}>
      {(label || showDisabledToggle) && (
        <div className="mb-2 flex items-center justify-between">
          {label && (
            <label
              htmlFor={inputId}
              className="text-sm font-medium text-slate-700"
            >
              {label}
              {required && <span className="ml-1 text-rose-500">*</span>}
            </label>
          )}
          {showDisabledToggle && (
            <button
              type="button"
              role="switch"
              aria-checked={!isDisabled}
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full border transition ${
                isDisabled
                  ? "border-slate-300 bg-slate-200"
                  : "border-teal-300 bg-teal-400/80"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                  isDisabled ? "translate-x-1" : "translate-x-6"
                }`}
              />
            </button>
          )}
        </div>
      )}

      <div
        className={`relative rounded-2xl border bg-white/80 shadow-sm transition focus-within:ring-2 ${
          hasError
            ? "border-rose-400 focus-within:ring-rose-300/60"
            : "border-slate-200 focus-within:ring-teal-300/60"
        } ${isDisabled ? "opacity-60" : "opacity-100"}`}
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-slate-100" />
        <div className="relative flex items-center gap-2 px-4 py-3">
          {leadingIcon && (
            <span className="text-slate-500">{leadingIcon}</span>
          )}
          <input
            id={inputId}
            name={name}
            type={type}
            autoComplete={autoComplete}
            required={required}
            disabled={isDisabled}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed"
          />
          {trailingIcon && (
            <span className="text-slate-500">{trailingIcon}</span>
          )}
        </div>
      </div>

      {(helperText || error) && (
        <p
          className={`mt-2 text-sm ${
            hasError ? "text-rose-500" : "text-slate-500"
          }`}
        >
          {error ?? helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
