import { WarningIcon } from "@phosphor-icons/react";
import { type ComponentProps, useId } from "react";

interface InputProps extends ComponentProps<"input"> {
  label: string;
  error?: string;
  prefix?: string;
}

export function Input({ label, error, prefix, id, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasError = Boolean(error);

  return (
    <div className="group flex flex-col gap-2" data-error={hasError}>
      <label
        htmlFor={inputId}
        className="text-xs uppercase text-gray-500 group-focus-within:font-bold group-focus-within:text-blue-base group-data-[error=true]:font-bold group-data-[error=true]:text-danger"
      >
        {label}
      </label>

      <div className="flex h-12 items-center rounded-lg border border-gray-300 px-4 text-md group-focus-within:border-blue-base group-focus-within:ring-1 group-focus-within:ring-blue-base group-data-[error=true]:border-danger group-data-[error=true]:ring-1 group-data-[error=true]:ring-danger">
        {prefix && <span className="text-gray-400">{prefix}</span>}

        <input
          id={inputId}
          aria-invalid={hasError}
          className="h-full min-w-0 flex-1 bg-transparent text-gray-600 caret-blue-base outline-none placeholder:text-gray-400"
          {...props}
        />
      </div>

      {error && (
        <span className="flex items-center gap-2 text-sm text-gray-500">
          <WarningIcon className="size-4 shrink-0 text-danger" />
          {error}
        </span>
      )}
    </div>
  );
}
