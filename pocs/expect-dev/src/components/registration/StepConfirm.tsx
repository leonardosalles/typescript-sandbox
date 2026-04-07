import { PLANS } from "./constants";

type AccountData = {
  email: string;
};

type ProfileData = {
  firstName: string;
  lastName: string;
  username: string;
  role: string;
};

type PlanData = {
  plan: string;
};

type StepConfirmProps = {
  account: AccountData;
  profile: ProfileData;
  plan: PlanData;
};

export function StepConfirm({ account, profile, plan }: StepConfirmProps) {
  const selectedPlan = PLANS.find((p) => p.id === plan.plan);

  const sections = [
    {
      title: "Account",
      rows: [
        ["Email", account.email],
        ["Password", "••••••••"],
      ],
    },
    {
      title: "Profile",
      rows: [
        ["Name", `${profile.firstName} ${profile.lastName}`.trim() || "—"],
        ["Username", profile.username || "—"],
        ["Role", profile.role || "—"],
      ],
    },
    {
      title: "Plan",
      rows: [
        ["Selected", selectedPlan?.label || "—"],
        ["Price", selectedPlan?.price || "—"],
      ],
    },
  ] as const;

  return (
    <div>
      <h2 className="rf-stepTitle">Review & confirm</h2>

      {sections.map(({ title, rows }) => (
        <div key={title} className="rf-confirmSection">
          <div className="rf-confirmSectionHeader">{title}</div>

          <table className="rf-confirmTable">
            <tbody>
              {rows.map(([k, v]) => (
                <tr key={k} className="rf-confirmRow">
                  <td className="rf-confirmKey">{k}</td>
                  <td
                    data-testid={`confirm-${k.toLowerCase().replace(/\s/g, "-")}`}
                    className="rf-confirmValue"
                  >
                    {v}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
