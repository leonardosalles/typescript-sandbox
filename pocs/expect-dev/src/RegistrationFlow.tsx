import { useState } from "react";

import { STEPS } from "./components/registration/constants";
import { StepIndicator } from "./components/registration/StepIndicator";
import { StepAccount } from "./components/registration/StepAccount";
import { StepProfile } from "./components/registration/StepProfile";
import { StepPlan } from "./components/registration/StepPlan";
import { StepConfirm } from "./components/registration/StepConfirm";
import { SuccessScreen } from "./components/registration/SuccessScreen";

type AccountState = {
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

type ProfileState = {
  firstName: string;
  lastName: string;
  username: string;
  role: string;
  notifProduct: boolean;
  notifSecurity: boolean;
  notifNewsletter: boolean;
};

type PlanState = {
  plan: string;
};

export function RegistrationFlow() {
  const [step, setStep] = useState(0);

  const [done, setDone] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [account, setAccount] = useState<AccountState>({
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [profile, setProfile] = useState<ProfileState>({
    firstName: "",
    lastName: "",
    username: "",
    role: "",
    notifProduct: true,
    notifSecurity: true,
    notifNewsletter: false,
  });

  const [plan, setPlan] = useState<PlanState>({ plan: "pro" });

  const updateAccount = <K extends keyof AccountState>(
    k: K,
    v: AccountState[K],
  ) => setAccount((p) => ({ ...p, [k]: v }));

  const updateProfile = <K extends keyof ProfileState>(
    k: K,
    v: ProfileState[K],
  ) => setProfile((p) => ({ ...p, [k]: v }));

  const updatePlan = <K extends keyof PlanState>(k: K, v: PlanState[K]) =>
    setPlan((p) => ({ ...p, [k]: v }));

  function validate() {
    const e: Record<string, string> = {};

    if (step === 0) {
      if (!account.email || !/\S+@\S+\.\S+/.test(account.email))
        e.email = "A valid email is required.";

      if (!account.password || account.password.length < 8)
        e.password = "Password must be at least 8 characters.";

      if (account.password !== account.confirmPassword)
        e.confirmPassword = "Passwords do not match.";

      if (!account.terms) e.terms = "You must accept the terms to continue.";
    }

    if (step === 1) {
      if (!profile.firstName.trim()) e.firstName = "First name is required.";

      if (!profile.lastName.trim()) e.lastName = "Last name is required.";

      if (!profile.username.trim()) e.username = "Username is required.";
      else if (!/^[a-z0-9_]+$/i.test(profile.username))
        e.username = "Only letters, numbers, and underscores.";

      if (!profile.role) e.role = "Please select a role.";
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validate()) return;

    if (step === STEPS.length - 1) {
      setDone(true);
      return;
    }

    setErrors({});

    setStep((s) => s + 1);
  }

  function back() {
    setErrors({});

    setStep((s) => s - 1);
  }

  if (done) return <SuccessScreen email={account.email} />;

  return (
    <div className="rf-container">
      <div className="rf-header">
        <h1 className="rf-title">Sign up</h1>

        <p className="rf-subtitle">Create a new account to get started.</p>
      </div>

      <StepIndicator current={step} />

      <div className="rf-card">
        {step === 0 && (
          <StepAccount
            data={account}
            onChange={updateAccount}
            errors={errors}
          />
        )}

        {step === 1 && (
          <StepProfile
            data={profile}
            onChange={updateProfile}
            errors={errors}
          />
        )}

        {step === 2 && <StepPlan data={plan} onChange={updatePlan} />}

        {step === 3 && (
          <StepConfirm account={account} profile={profile} plan={plan} />
        )}
      </div>

      <div className="rf-footer">
        <button
          data-testid="btn-back"
          onClick={back}
          disabled={step === 0}
          className={
            "rf-secondaryButton " +
            (step === 0 ? "rf-secondaryButton--disabled" : "")
          }
        >
          Back
        </button>

        <div className="rf-footerRight">
          <span className="rf-stepCount">
            {step + 1} of {STEPS.length}
          </span>

          <button
            data-testid="btn-next"
            onClick={next}
            className="rf-primaryButton"
          >
            {step === STEPS.length - 1 ? "Create account" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
