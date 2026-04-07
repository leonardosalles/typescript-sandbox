import { FieldError } from "./FieldError";

type InputProps = {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
};

export function Input({
  label,
  id,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
}: InputProps) {
  return (
    <div className="rf-field">
      <label htmlFor={id} className="rf-label">
        {label}
      </label>

      <input
        id={id}
        data-testid={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={"rf-input " + (error ? "rf-input--error" : "")}
      />

      <FieldError message={error} />
    </div>
  );
}
