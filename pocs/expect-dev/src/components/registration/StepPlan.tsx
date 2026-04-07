import { PLANS } from "./constants";

type PlanData = {
  plan: string;
};

type StepPlanProps = {
  data: PlanData;
  onChange: (key: keyof PlanData, value: PlanData[keyof PlanData]) => void;
};

export function StepPlan({ data, onChange }: StepPlanProps) {
  return (
    <div>
      <h2 className="rf-stepTitle">Choose a plan</h2>

      <div className="rf-planList">
        {PLANS.map((plan) => {
          const selected = data.plan === plan.id;

          return (
            <div
              key={plan.id}
              data-testid={`plan-${plan.id}`}
              role="radio"
              aria-checked={selected}
              onClick={() => onChange("plan", plan.id)}
              className={"rf-planCard " + (selected ? "rf-planCard--selected" : "")}
            >
              <div
                className={
                  "rf-planRadio " + (selected ? "rf-planRadio--selected" : "")
                }
              />

              <div className="rf-planBody">
                <div className="rf-planHeader">
                  <span className="rf-planName">{plan.label}</span>
                  <span className="rf-planPrice">{plan.price}</span>
                </div>

                <ul className="rf-planFeatures">
                  {plan.features.map((f) => (
                    <li key={f} className="rf-planFeature">
                      <span className="rf-planFeatureCheck">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
