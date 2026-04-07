import { FieldError } from "./FieldError";
import { Input } from "./Input";

type AccountData = {
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

type StepAccountProps = {
  data: AccountData;
  onChange: (key: keyof AccountData, value: AccountData[keyof AccountData]) => void;
  errors: Record<string, string>;
};

export function StepAccount({ data, onChange, errors }: StepAccountProps) {
  return (
    <div>
      <h2 className="rf-stepTitle">Create your account</h2>

      <Input
        label="Email address"
        id="email"
        type="email"
        value={data.email}
        onChange={(v) => onChange("email", v)}
        error={errors.email}
        placeholder="you@example.com"
        autoComplete="email"
      />

      <Input
        label="Password"
        id="password"
        type="password"
        value={data.password}
        onChange={(v) => onChange("password", v)}
        error={errors.password}
        placeholder="At least 8 characters"
        autoComplete="new-password"
      />

      <Input
        label="Confirm password"
        id="confirmPassword"
        type="password"
        value={data.confirmPassword}
        onChange={(v) => onChange("confirmPassword", v)}
        error={errors.confirmPassword}
        placeholder="Repeat password"
        autoComplete="new-password"
      />

      <div className="rf-termsRow">
        <input
          id="terms"
          data-testid="terms"
          type="checkbox"
          checked={data.terms}
          onChange={(e) => onChange("terms", e.target.checked)}
          className="rf-checkbox rf-checkbox--terms"
        />

        <label htmlFor="terms" className="rf-termsLabel">
          I agree to the{" "}
          <a href="#" className="rf-link">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="rf-link">
            Privacy Policy
          </a>
        </label>
      </div>

      <FieldError message={errors.terms} />
    </div>
  );
}
