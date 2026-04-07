export const STEPS = ["Account", "Profile", "Plan", "Confirm"] as const;

export const PLANS = [
  {
    id: "free",
    label: "Free",
    price: "$0",
    features: ["5 projects", "Community support", "Basic analytics"],
  },
  {
    id: "pro",
    label: "Pro",
    price: "$29/mo",
    features: [
      "Unlimited projects",
      "Priority support",
      "Advanced analytics",
      "Custom domains",
    ],
  },
  {
    id: "team",
    label: "Team",
    price: "$99/mo",
    features: ["Everything in Pro", "Team management", "SSO", "SLA guarantee"],
  },
] as const;
