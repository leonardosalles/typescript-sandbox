import { FieldError } from "./FieldError";
import { Input } from "./Input";

type ProfileData = {
  firstName: string;
  lastName: string;
  username: string;
  role: string;
  notifProduct: boolean;
  notifSecurity: boolean;
  notifNewsletter: boolean;
};

type StepProfileProps = {
  data: ProfileData;
  onChange: (key: keyof ProfileData, value: ProfileData[keyof ProfileData]) => void;
  errors: Record<string, string>;
};

const NOTIFICATIONS = [
  { id: "notif-product", key: "notifProduct", label: "Product updates" },
  { id: "notif-security", key: "notifSecurity", label: "Security alerts" },
  { id: "notif-newsletter", key: "notifNewsletter", label: "Newsletter" },
] as const;

export function StepProfile({ data, onChange, errors }: StepProfileProps) {
  return (
    <div>
      <h2 className="rf-stepTitle">Your profile</h2>

      <div className="rf-grid2">
        <Input
          label="First name"
          id="firstName"
          value={data.firstName}
          onChange={(v) => onChange("firstName", v)}
          error={errors.firstName}
          placeholder="Ada"
          autoComplete="given-name"
        />

        <Input
          label="Last name"
          id="lastName"
          value={data.lastName}
          onChange={(v) => onChange("lastName", v)}
          error={errors.lastName}
          placeholder="Lovelace"
          autoComplete="family-name"
        />
      </div>

      <Input
        label="Username"
        id="username"
        value={data.username}
        onChange={(v) => onChange("username", v)}
        error={errors.username}
        placeholder="ada_lovelace"
        autoComplete="username"
      />

      <div className="rf-field">
        <label htmlFor="role" className="rf-label">
          Role
        </label>

        <select
          id="role"
          data-testid="role"
          value={data.role}
          onChange={(e) => onChange("role", e.target.value)}
          className="rf-select"
        >
          <option value="">Select a role...</option>
          <option value="engineer">Engineer</option>
          <option value="designer">Designer</option>
          <option value="pm">Product Manager</option>
          <option value="founder">Founder</option>
          <option value="other">Other</option>
        </select>

        <FieldError message={errors.role} />
      </div>

      <div className="rf-field">
        <label className="rf-label rf-label--withSpacing">Notifications</label>

        {NOTIFICATIONS.map(({ id, key, label }) => (
          <div key={id} className="rf-checkboxRow">
            <input
              id={id}
              data-testid={id}
              type="checkbox"
              checked={data[key]}
              onChange={(e) => onChange(key, e.target.checked)}
              className="rf-checkbox"
            />

            <label htmlFor={id} className="rf-checkboxLabel">
              {label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
