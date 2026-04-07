type FieldErrorProps = {
  message?: string;
};

export function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;

  return (
    <p role="alert" data-testid="field-error" className="rf-fieldError">
      {message}
    </p>
  );
}
