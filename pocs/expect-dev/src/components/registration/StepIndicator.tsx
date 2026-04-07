import { STEPS } from "./constants";

type StepIndicatorProps = {
  current: number;
};

export function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div className="rf-stepIndicator">
      {STEPS.map((label, i) => (
        <div
          key={label}
          className={
            "rf-stepIndicatorItem " +
            (i < STEPS.length - 1 ? "rf-stepIndicatorItem--flex" : "")
          }
        >
          <div className="rf-stepIndicatorItemInner">
            <div
              data-testid={`step-dot-${i}`}
              aria-label={`Step ${i + 1}: ${label}`}
              className={
                "rf-stepDot " +
                (i < current
                  ? "rf-stepDot--completed"
                  : i === current
                    ? "rf-stepDot--current"
                    : "rf-stepDot--upcoming")
              }
            >
              {i < current ? "✓" : i + 1}
            </div>

            <span
              className={
                "rf-stepLabel " + (i === current ? "rf-stepLabel--current" : "")
              }
            >
              {label}
            </span>
          </div>

          {i < STEPS.length - 1 && (
            <div
              className={
                "rf-stepConnector " +
                (i < current
                  ? "rf-stepConnector--completed"
                  : "rf-stepConnector--upcoming")
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}
